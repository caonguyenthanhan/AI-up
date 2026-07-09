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
    id: 'day-0',
    slug: 'day-0',
    title: 'Day 0: Lộ Trình Kỹ Sư AI',
    excerpt: 'Bắt đầu hành trình trở thành kỹ sư AI thực thụ. Chúng ta sẽ xây dựng nền tảng vững chắc từ những khái niệm cơ bản đến các kỹ thuật tiên tiến.',
    readTime: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddB3XqetatTluwLs1mjpP4IzTxvDH_zOzrk8_GvpmR7UBw-daVIMO-5xWQmDtD3ydaBk_1TKu9AWCgt376nv1ye31BuMKV0_i5E_TSNqh2RVPpIwAcLuhGSYE0cTA24HKPTpj70OpCvmUmbe12zoncJT8TfYKG0tsEcWKZRScoT-wyscdtxyyei906uF-R-UK_pbDUYLtH-zEBkDKUxKTCsRzrTBzvgbio5Rcn0qZEwSy7QFPw5B7XqiNdhoU2tHlNcK-hnzL7UAF',
    imageAlt: 'A cinematic neural network structure',
    tag: 'Roadmap',
    content: `<h2>Hành trình bắt đầu</h2>
<p>AI-up Insights được sinh ra từ một mục tiêu rõ ràng: tạo ra một nguồn tài nguyên toàn diện để giúp các nhà phát triển, kỹ sư máy học và những người yêu thích AI hiểu rõ hơn về cách thức hoạt động của trí tuệ nhân tạo hiện đại.</p>

<h2>Chúng ta sẽ tìm hiểu gì?</h2>
<p>Từ những khái niệm cơ bản cho đến các kỹ thuật tiên tiến nhất, blog này sẽ hướng dẫn bạn qua:</p>
<ul>
<li><strong>Large Language Models (LLMs)</strong>: Cách các mô hình ngôn ngữ lớn hoạt động, được huấn luyện và tối ưu hóa</li>
<li><strong>Context Engineering</strong>: Quản lý bộ nhớ và ngữ cảnh cho LLM</li>
<li><strong>GraphRAG</strong>: Kỹ thuật RAG nâng cao với đồ thị kiến thức</li>
<li><strong>Agentic Workflows</strong>: Xây dựng các hệ thống AI có khả năng tự động hoạt động</li>
</ul>

<h2>Tại sao lại quan trọng?</h2>
<p>Trong thế giới AI đang thay đổi nhanh chóng này, hiểu biết sâu sắc không phải là một lợi thế - nó là một yêu cầu. Chúng tôi cam kết giúp bạn trở thành một kỹ sư AI thực sự, người không chỉ sử dụng các công cụ mà hiểu rõ cơ chế đằng sau chúng.</p>

<p>Hãy bắt đầu hành trình với chúng tôi.</p>`,
    date: '2025-01-15',
  },
  {
    id: 'day-1',
    slug: 'day-1',
    title: 'Day 1: Context Engineering - Quản lý bộ nhớ LLM',
    excerpt: 'Tại sao việc hiểu cấu trúc dữ liệu lại quan trọng hơn việc viết prompt giỏi? Chúng ta bắt đầu hành trình bằng việc định nghĩa lại cách tiếp cận hệ thống dựa trên AI.',
    readTime: 8,
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
    id: 'day-2',
    slug: 'day-2',
    title: 'Day 2: GraphRAG — Cứu Tinh Của Bài Toán Suy Luận Nhiều Bước',
    excerpt: 'Deep dive vào GraphRAG và cách sử dụng đồ thị kiến thức để giải quyết các vấn đề suy luận phức tạp mà Vector RAG không thể xử lý.',
    readTime: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkLioWezc-Pyj_ckedi37kspmw7qQCbHTGo7gbn5HJpu-Ar1tGbw-_cVxXKpGxlao_Xdm9Rz9u6ED-ExQNpkTdiOIBfbjvaC4rRp1y-l7Dd_wKT3LONZ8yxcgtwIUe8IeyGYcTBW5gnnY9i4BPIKFH7onVvmbTupimnddMckZzreXB50QbFQw9XtdttJJZQ1djX7BBNizqmhH9VsIyLPGSb5Ia8C6WBuKrRrs4Qh2TdTZLY59b0waN2DhN9So-cFRnj6GOLaOj4MQc',
    imageAlt: 'Data retrieval visualization',
    tag: 'RAG',
    content: `<h2>Vấn đề với Vector RAG truyền thống</h2>
<p>Chào ông, tiếp tục ngày thứ 2 trong lộ trình. Hôm qua chúng ta đã xử lý phần bộ nhớ (Context Engineering) để giúp LLM không bị "ngáo" khi nhồi quá nhiều rác. Hôm nay, chúng ta sẽ giải quyết một lỗ hổng chí mạng của kiến trúc RAG cơ bản: <strong>Khả năng suy luận nhiều bước (Multi-hop reasoning) và tính minh bạch</strong>.</p>
<p>Nếu ông đang dùng Vector Database (như Pinecone hay Qdrant) cho dự án RAG, cơ chế hoạt động thực chất rất ngây ngô: Nó băm văn bản thành các đoạn (chunks), biến thành chuỗi số (vectors), và khi user đặt câu hỏi, nó tìm các đoạn text có <i>khoảng cách toán học</i> gần nhất.</p>

<h2>Case Study: Vấn đề thực tế</h2>
<p>"Bệnh nhân X đang dùng thuốc Ibudilast, liệu có hiệu quả với bệnh Đa xơ cứng (Multiple Sclerosis) không?"</p>
<p>Một hệ thống Vector RAG thuần túy sẽ thất bại thảm hại ở đây. Tại sao? Vì rất có thể không có một đoạn text duy nhất nào chứa cả "Ibudilast" và "Multiple Sclerosis" cạnh nhau. Thuật toán vector sẽ lấy về những đoạn text rời rạc, thiếu đi sợi dây liên kết logic, dẫn đến việc LLM thiếu thông tin và trả lời sai, hoặc tệ hơn là rơi vào trạng thái <strong>Accuracy Fallacy (Sai lầm độ chính xác)</strong>.</p>

<h2>GraphRAG: Ánh sáng cuối đường hầm</h2>
<p>Để giải quyết giới hạn này, <strong>GraphRAG (Retrieval-Augmented Generation dựa trên Đồ thị)</strong> ra đời. Thay vì lưu trữ các đoạn text mù mờ, GraphRAG sử dụng LLM ở bước tiền xử lý (Ingestion) để đọc tài liệu và trích xuất ra các <strong>Thực thể (Entities)</strong> và <strong>Mối quan hệ (Relationships)</strong>, sau đó lưu chúng vào một Cơ sở dữ liệu Đồ thị (Knowledge Graph) như Neo4j.</p>

<h2>Kiến trúc GraphRAG</h2>
<p><strong>1. Xây dựng (Building)</strong>: Chạy LLM nhận diện thực thể và mối quan hệ thô, lưu vào Neo4j.</p>
<p><strong>2. Truy xuất Lai (Hybrid Retrieval)</strong>: Kết hợp Vector Search để tìm Node khởi điểm và mở rộng 2-3 hops.</p>
<p><strong>3. Trình bày (Presentation)</strong>: Chuyển cụm đồ thị thành văn bản có cấu trúc cho Prompt cuối.</p>

<p>Kiến trúc này chuyển đổi dữ liệu phi cấu trúc thành các bộ ba (triples) dạng <span class="code-inline">(Node A) -&gt; [Mối quan hệ] -&gt; (Node B)</span>. Khi user hỏi về thuốc Ibudilast, hệ thống truy xuất sẽ không tìm kiếm text mù quáng nữa. Nó tìm Node [Ibudilast], sau đó đi dọc theo các cạnh (edges) trong đồ thị: [Ibudilast] -&gt; thuộc nhóm -&gt; [CTRP Terminology] -&gt; liên quan đến -&gt; [Multiple Sclerosis].</p>

<h2>Tại sao GraphRAG quan trọng?</h2>
<p>Khác biệt giữa kỹ sư học việc và kỹ sư 300.000 USD nằm ở chỗ ông có thể đảm bảo <strong>Tính minh bạch (Explainability)</strong> cho khách hàng doanh nghiệp. Vector Search là một chiếc "hộp đen" (black-box) — ông không thể giải thích tại sao hai vector lại gần nhau một cách rõ ràng.</p>
<p>Với GraphRAG, nếu LLM đưa ra kết luận, ông hoàn toàn có thể in ra chuỗi logic (đường đi trong đồ thị) để chứng minh cho người dùng thấy: <i>"Hệ thống đưa ra kết luận này vì nó đi từ Node A sang Node B qua quy định C"</i>. Ngoài ra, nó giải quyết triệt để bài toán tổng hợp (Aggregation) — việc mà Vector RAG hoàn toàn bó tay.</p>

<p><strong>Tóm lại</strong>, nếu Vector Database là bộ não "cảm nhận" bằng trực giác, thì Knowledge Graph là bộ não "suy luận" bằng logic toán học. Ghép hai thứ này lại, ông sẽ có một hệ thống RAG cấp độ production.</p>`,
    date: '2025-01-17',
  },
  {
    id: 'day-3',
    slug: 'day-3',
    title: 'Day 3: Agentic Workflows - Từ LLM đến Autonomous Agents',
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
