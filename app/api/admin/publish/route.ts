import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate session
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Phiên làm việc không hợp lệ' },
        { status: 401 }
      );
    }

    // 2. Parse input parameters
    const { slug, title, date, tags, content } = await request.json();
    if (!slug || !title || !date || !tags || !content) {
      return NextResponse.json(
        { error: 'Tất cả các trường (slug, title, date, tags, content) là bắt buộc' },
        { status: 400 }
      );
    }

    // 3. Format date to display string (e.g., "Thứ Năm, 09/07/2026")
    const dateObj = new Date(date);
    const dayStr = dateObj.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedDateDisplay = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);

    // 4. Format tags array to string (e.g., "#Introduction #Roadmap")
    const formattedTagsString = tags.map((t: string) => `#${t.trim()}`).join(' ');

    // 5. Construct HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <span class="date">${formattedDateDisplay}</span>
        <h1>${title}</h1>
        <div class="tags">${formattedTagsString}</div>
    </header>

    <main>
        ${content}
    </main>
</body>
</html>`;

    // 6. Call GitHub API
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !owner || !repo) {
      return NextResponse.json(
        { error: 'Cấu hình GitHub API (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO) bị thiếu trên máy chủ' },
        { status: 500 }
      );
    }

    const githubHeaders = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AI-up-Admin-App',
      'Content-Type': 'application/json',
    };

    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/detail/${slug}.html`;

    // Get the file first to check if it exists and fetch its sha
    let sha: string | undefined;
    try {
      const getResponse = await fetch(`${fileUrl}?ref=${branch}`, {
        method: 'GET',
        headers: githubHeaders,
        cache: 'no-store',
      });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }
    } catch (err) {
      console.warn('GitHub GET file error (file may not exist yet):', err);
    }

    // Prepare commit body
    const commitMessage = sha 
      ? `chore: update article "${title}"` 
      : `chore: publish article "${title}"`;
      
    const base64Content = Buffer.from(htmlContent, 'utf-8').toString('base64');

    const putBody = {
      message: commitMessage,
      content: base64Content,
      sha,
      branch,
    };

    const putResponse = await fetch(fileUrl, {
      method: 'PUT',
      headers: githubHeaders,
      body: JSON.stringify(putBody),
    });

    const putData = await putResponse.json();

    if (!putResponse.ok) {
      throw new Error(putData.message || 'Không thể commit tệp lên GitHub');
    }

    // Return URL after deploy is complete (Vercel deploy URL)
    const vercelUrl = `/blog/${slug}`;

    return NextResponse.json({
      success: true,
      message: commitMessage,
      url: vercelUrl,
      sha: putData.content.sha,
    });

  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi máy chủ khi xuất bản bài viết' },
      { status: 500 }
    );
  }
}
