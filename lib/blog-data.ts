export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  image: string;
  imageAlt: string;
  tag: string;
  content: string;
  date: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: 'featured',
    slug: 'featured',
    title: 'Lời mở đầu: Hành trình giải mã trí tuệ nhân tạo',
    excerpt: 'Chào mừng bạn đến với AI-up Insights. Đây không chỉ là một blog công nghệ, mà là nơi chúng ta cùng nhau khám phá những ngóc ngách sâu nhất của LLMs, cơ chế RAG tối ưu và cách xây dựng hệ thống AI bền vững trong thực tế.',
    readTime: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddB3XqetatTluwLs1mjpP4IzTxvDH_zOzrk8_GvpmR7UBw-daVIMO-5xWQmDtD3ydaBk_1TKu9AWCgt376nv1ye31BuMKV0_i5E_TSNqh2RVPpIwAcLuhGSYE0cTA24HKPTpj70OpCvmUmbe12zoncJT8TfYKG0tsEcWKZRScoT-wyscdtxyyei906uF-R-UK_pbDUYLtH-zEBkDKUxKTCsRzrTBzvgbio5Rcn0qZEwSy7QFPw5B7XqiNdhoU2tHlNcK-hnzL7UAF',
    imageAlt: 'A cinematic neural network structure',
    tag: 'Featured',
    content: `<h2>Hành trình bắt đầu</h2>
<p>AI-up Insights được sinh ra từ một mục tiêu rõ ràng: tạo ra một nguồn tài nguyên toàn diện để giúp các nhà phát triển, kỹ sư máy học và những người yêu thích AI hiểu rõ hơn về cách thức hoạt động của trí tuệ nhân tạo hiện đại.</p>

<h2>Chúng ta sẽ tìm hiểu gì?</h2>
<p>Từ những khái niệm cơ bản cho đến các kỹ thuật tiên tiến nhất, blog này sẽ hướng dẫn bạn qua:</p>
<ul>
<li><strong>Large Language Models (LLMs)</strong>: Cách các mô hình ngôn ngữ lớn hoạt động, được huấn luyện và tối ưu hóa</li>
<li><strong>Retrieval-Augmented Generation (RAG)</strong>: Kỹ thuật kết hợp retrieval và generation để cải thiện chất lượng phản hồi</li>
<li><strong>Agentic Workflows</strong>: Xây dựng các hệ thống AI có khả năng tự động hoạt động và đưa ra quyết định</li>
</ul>

<h2>Tại sao lại quan trọng?</h2>
<p>Trong thế giới AI đang thay đổi nhanh chóng này, hiểu biết sâu sắc không phải là một lợi thế - nó là một yêu cầu. Chúng tôi cam kết giúp bạn trở thành một kỹ sư AI thực sự, người không chỉ sử dụng các công cụ mà hiểu rõ cơ chế đằng sau chúng.</p>

<p>Hãy bắt đầu hành trình với chúng tôi.</p>`,
    date: '2025-01-15',
  },
  {
    id: 'day1',
    slug: 'day1',
    title: 'Thiết lập nền tảng: Từ Prompt đến Architecture',
    excerpt: 'Tại sao việc hiểu cấu trúc dữ liệu lại quan trọng hơn việc viết prompt giỏi? Chúng ta bắt đầu hành trình bằng việc định nghĩa lại cách tiếp cận hệ thống dựa trên AI.',
    readTime: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3e5mL1KJFRlip_tnXWpy3DXNK4myNjW5VuKkHi6H5S5LtcqE725XAv2jL2Dt1o2Mt1gVHxzWjAxORskcV7ykCzk_o83NVX6PirRU17wWN_zAy0BwTxdKlDwaitwEc9nbwXRurvlNM4FHxOzhblbAYoIlvvHhtEGYwFi22SJCHA3A35HFNMWElJaKksYAcedOp3X-2nWEt7DhmYvUJuOxqhLSb7ujikFzqvxdhPSkBvX1MWqf6QEOqtP_hZvwc9iv6hhSiCybCSXus',
    imageAlt: 'Minimalist 3D code blocks',
    tag: 'LLM',
    content: `<h2>Nền tảng của một hệ thống AI tốt</h2>
<p>Trước khi viết một dòng code hay craft một prompt hoàn hảo, bạn cần hiểu rõ cơ sở hạ tầng. Đây là nền tảng mà tất cả mọi thứ khác được xây dựng.</p>

<h2>Cấu trúc dữ liệu là chìa khóa</h2>
<p>Hầu hết các lỗi trong các hệ thống AI không phải do mô hình, mà do cách dữ liệu được tổ chức và truyền tải. Chúng tôi sẽ khám phá:</p>
<ul>
<li>Cách tổ chức dữ liệu cho hiệu quả tối đa</li>
<li>Streaming dữ liệu trong thời gian thực</li>
<li>Xử lý dữ liệu không cấu trúc</li>
</ul>

<h2>Từ thiết kế đến triển khai</h2>
<p>Một kiến trúc tốt là giữa vàng của bất kỳ hệ thống AI nào. Hãy cùng tìm hiểu các nguyên tắc thiết kế cơ bản.</p>`,
    date: '2025-01-16',
  },
  {
    id: 'day2',
    slug: 'day2',
    title: 'Tối ưu hóa RAG: Khi Retrieval gặp Context',
    excerpt: 'Deep dive vào các kỹ thuật phân mảnh dữ liệu (chunking) và vector embeddings để giảm thiểu hiện tượng "hallucination" trong mô hình ngôn ngữ lớn.',
    readTime: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkLioWezc-Pyj_ckedi37kspmw7qQCbHTGo7gbn5HJpu-Ar1tGbw-_cVxXKpGxlao_Xdm9Rz9u6ED-ExQNpkTdiOIBfbjvaC4rRp1y-l7Dd_wKT3LONZ8yxcgtwIUe8IeyGYcTBW5gnnY9i4BPIKFH7onVvmbTupimnddMckZzreXB50QbFQw9XtdttJJZQ1djX7BBNizqmhH9VsIyLPGSb5Ia8C6WBuKrRrs4Qh2TdTZLY59b0waN2DhN9So-cFRnj6GOLaOj4MQc',
    imageAlt: 'Data retrieval visualization',
    tag: 'RAG',
    content: `<h2>Vấn đề với Hallucinations</h2>
<p>Một trong những vấn đề lớn nhất của LLMs là hallucination - khi mô hình tạo ra thông tin không chính xác. RAG giúp giải quyết điều này bằng cách cung cấp ngữ cảnh chính xác.</p>

<h2>Chunking: Chia để trị</h2>
<p>Cách bạn chia dữ liệu của mình ảnh hưởng trực tiếp đến kết quả. Các chiến lược chunking khác nhau sẽ cho ra các kết quả khác nhau:</p>
<ul>
<li>Fixed-size chunking</li>
<li>Semantic chunking</li>
<li>Hierarchical chunking</li>
</ul>

<h2>Vector Embeddings: Ngôn ngữ của máy</h2>
<p>Embeddings là cách máy tính "hiểu" ý nghĩa. Chúng ta sẽ tìm hiểu cách sử dụng embeddings hiệu quả trong RAG pipeline.</p>`,
    date: '2025-01-17',
  },
  {
    id: 'day3',
    slug: 'day3',
    title: 'Xây dựng Agentic Workflows đầu tiên',
    excerpt: 'Vượt xa hơn các phản hồi đơn lẻ. Học cách thiết kế hệ thống có khả năng tự lập kế hoạch và thực thi nhiệm vụ phức tạp thông qua các công cụ.',
    readTime: 7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChgXz_2KI-MHde4yVyJ3S8e-dx6BNd_SmNL1xUSqSmRnRNrz4hky5XYeebBS8YDEhYQiaAlNZFBT0dNXEq0HTEeAqUGiiQkb2FP4mOdkEBaNTSgZTdmqteoPHerD_EqW91bH1q4v0Blzip969i2EBz29D7qEcHW_wAUsc2YPCxQNbTRzjcSdWG3tWKYyjJSsBrC7-PWLlIVdVvsJEv_SQ3G-G_i_IGS6u-Tjut999NddhuGNx520tRdR93ba-24YeaLgl9vz2H0K-D',
    imageAlt: 'Futuristic terminal interface',
    tag: 'Engineering',
    content: `<h2>Từ Chatbot đến Agent</h2>
<p>Chatbots phản ứng - Agents chủ động. Agents có khả năng lập kế hoạch, suy luận và sử dụng công cụ để hoàn thành các nhiệm vụ phức tạp.</p>

<h2>Các thành phần của một Agent</h2>
<ul>
<li><strong>Perception</strong>: Hiểu biết về trạng thái hiện tại</li>
<li><strong>Planning</strong>: Lập kế hoạch hành động</li>
<li><strong>Execution</strong>: Thực thi các công cụ</li>
<li><strong>Feedback</strong>: Học từ kết quả</li>
</ul>

<h2>Tools & Integrations</h2>
<p>Agents không mạnh mẽ nếu không có tools. Chúng tôi sẽ tìm hiểu cách tích hợp APIs, databases, và các dịch vụ bên ngoài.</p>

<h2>Xây dựng Agent đầu tiên</h2>
<p>Cuối cùng, chúng ta sẽ xây dựng một agent hoàn chỉnh có thể xử lý các nhiệm vụ thực tế.</p>`,
    date: '2025-01-18',
  },
];

export function getBlogArticles() {
  return blogArticles;
}

export function getBlogArticleBySlug(slug: string) {
  return blogArticles.find(article => article.slug === slug);
}

export function getBlogArticleIndex(slug: string) {
  return blogArticles.findIndex(article => article.slug === slug);
}

export function getNextArticle(slug: string) {
  const index = getBlogArticleIndex(slug);
  if (index === -1 || index === blogArticles.length - 1) return null;
  return blogArticles[index + 1];
}

export function getPreviousArticle(slug: string) {
  const index = getBlogArticleIndex(slug);
  if (index <= 0) return null;
  return blogArticles[index - 1];
}
