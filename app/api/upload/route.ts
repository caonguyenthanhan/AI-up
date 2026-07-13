import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const isSessionValid = await verifyAdminSession();
    const { fileName, content, password } = await req.json();

    // 1. Validate required fields (password is only required if session is invalid)
    if (!fileName || !content || (!isSessionValid && !password)) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (Tên file hoặc nội dung).' },
        { status: 400 }
      );
    }

    // 2. Validate file extension (only .html and .md are allowed)
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext !== 'html' && ext !== 'md') {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận các file có định dạng .html hoặc .md.' },
        { status: 400 }
      );
    }

    // 3. Validate server configuration
    const GITHUB_PAT = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'caonguyenthanhan';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'AI-up';

    if (!GITHUB_PAT) {
      return NextResponse.json(
        { error: 'Cấu hình máy chủ bị thiếu: GITHUB_PAT hoặc GITHUB_TOKEN chưa được cài đặt.' },
        { status: 500 }
      );
    }

    // 4. Validate authentication (fallback to password check if session is not valid)
    if (!isSessionValid) {
      const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD || process.env.ADMIN_PASSWORD;
      if (!UPLOAD_PASSWORD) {
        return NextResponse.json(
          { error: 'Cấu hình máy chủ bị thiếu: UPLOAD_PASSWORD hoặc ADMIN_PASSWORD chưa được cài đặt.' },
          { status: 500 }
        );
      }

      if (password !== UPLOAD_PASSWORD) {
        return NextResponse.json(
          { error: 'Mật khẩu quản trị không chính xác.' },
          { status: 401 }
        );
      }
    }

    const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/detail/${fileName}`;
    const headers = {
      'Authorization': `Bearer ${GITHUB_PAT}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'NextJS-Blog-Uploader',
    };

    // 5. Check if the file already exists on GitHub to retrieve its SHA
    let existingSha: string | undefined = undefined;
    try {
      const getResponse = await fetch(githubApiUrl, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });

      if (getResponse.status === 200) {
        const fileData = await getResponse.json();
        existingSha = fileData.sha;
      }
    } catch (err) {
      console.error('Error checking existing file on GitHub:', err);
      // We continue, assuming it's a new file. If it fails, the PUT request will return the error.
    }

    // 6. Encode content to Base64 (using UTF-8 safely)
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    // 7. Write/Update the file on GitHub
    const putResponse = await fetch(githubApiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `feat: upload blog post ${fileName} via web admin console`,
        content: base64Content,
        sha: existingSha, // Required for updates, omitted or undefined for new files
        branch: 'main',
      }),
    });

    if (!putResponse.ok) {
      const errorData = await putResponse.json();
      return NextResponse.json(
        { error: `Lỗi kết nối GitHub: ${errorData.message || 'Không thể tạo file.'}` },
        { status: putResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã upload và commit thành công bài viết '${fileName}' lên GitHub! Vercel sẽ tự động cập nhật trong giây lát.`,
    });

  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: `Lỗi hệ thống: ${error.message || 'Không xác định.'}` },
      { status: 500 }
    );
  }
}
