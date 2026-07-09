import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import OpenAI from 'openai';

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
    const { title, content, existingTags } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Tiêu đề và nội dung là bắt buộc' },
        { status: 400 }
      );
    }

    // 3. Initialize OpenAI Client
    const apiKey = process.env.AI_API_KEY;
    const baseURL = process.env.AI_BASE_URL || 'https://api.foza.ai/v1';
    const model = process.env.AI_MODEL || 'hoang/claude-haiku-4.5';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cấu hình AI_API_KEY bị thiếu trên máy chủ' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL,
    });

    const systemPrompt = `Bạn là một trợ lý AI chuyên nghiệp hỗ trợ biên tập bài viết công nghệ cho blog AI-up.
Nhiệm vụ của bạn là phân tích tiêu đề và nội dung bài viết HTML được cung cấp, đối chiếu với danh sách các tag hiện có, và trả về một đối tượng JSON chứa các đề xuất tối ưu.

Định dạng đầu ra BẮT BUỘC là một JSON Object duy nhất, không bọc trong markdown code block (không dùng \`\`\`json ... \`\`\`), có cấu trúc chính xác như sau:
{
  "suggestedTags": ["tag_hien_co_1", "tag_hien_co_2"], // Các tag phù hợp nhất trích từ danh sách tag_hiện_có được cung cấp
  "newTagSuggestions": ["tag_moi_1"], // Các đề xuất tag mới (nếu cần thiết, viết thường không dấu cách, vd: machine-learning, agentic-workflow)
  "seoDescription": "Mô tả ngắn gọn, cuốn hút cho SEO và thẻ meta description (dưới 160 ký tự)...",
  "diagrams": [
    {
      "afterHeading": "Tên Heading chính xác trong bài viết",
      "mermaidCode": "Mã Mermaid diagram hợp lệ (vd: graph TD hoặc sequenceDiagram) mô tả trực quan nội dung sau heading này"
    }
  ],
  "imageSuggestions": [
    {
      "afterHeading": "Tên Heading chính xác trong bài viết",
      "searchKeywords": "Từ khóa tiếng Anh ngắn để tìm kiếm ảnh minh họa trên Unsplash/Pexels phù hợp với phần này"
    }
  ]
}

Hãy phân tích kỹ nội dung bài viết:
1. Đọc danh sách tag hiện có và chọn ra tối đa 3 tag phù hợp nhất cho "suggestedTags". Danh sách tag hiện có: ${JSON.stringify(existingTags)}.
2. Nếu nội dung nói về một chủ đề mới chưa có trong danh sách tag, hãy đề xuất 1-2 tag mới trong "newTagSuggestions" (viết thường, dùng dấu gạch ngang, không dùng ký tự đặc biệt).
3. Tạo 1 mô tả SEO hấp dẫn dưới 160 ký tự trong "seoDescription".
4. Tìm các phần giải thích quy trình phức tạp (suy luận, luồng dữ liệu, so sánh, kiến trúc hệ thống) và tạo 1-2 sơ đồ Mermaid trong "diagrams" gắn với heading tương ứng chính xác có trong bài viết.
5. Gợi ý 1-2 từ khóa ảnh minh họa phù hợp cho các phần cụ thể trong "imageSuggestions".`;

    const userPrompt = `Tiêu đề bài viết: "${title}"
Nội dung bài viết (HTML):
${content}`;

    // 4. Call AI Model
    const chatCompletion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
    });

    let rawResponseContent = chatCompletion.choices[0]?.message?.content || '';
    rawResponseContent = rawResponseContent.trim();

    // 5. Parse and clean response safely
    if (rawResponseContent.startsWith('```')) {
      rawResponseContent = rawResponseContent
        .replace(/^```[a-zA-Z]*\n/, '')
        .replace(/\n```$/, '');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResponseContent.trim());
    } catch (e) {
      console.error('Failed to parse AI response as JSON. Content:', rawResponseContent, e);
      // Fallback response structure
      return NextResponse.json(
        {
          error: 'Mô hình AI trả về kết quả không đúng cấu trúc JSON mong muốn.',
          rawText: rawResponseContent
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error('AI analyze API error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi máy chủ khi kết nối AI Assistant' },
      { status: 500 }
    );
  }
}
