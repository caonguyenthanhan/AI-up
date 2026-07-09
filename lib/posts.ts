import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Define the post structure
export interface PostData {
  slug: string;
  title: string;
  dateString: string;
  date: string; // ISO string for sorting
  tags: string[];
  excerpt: string;
  contentHtml: string;
  fileType: 'html' | 'md';
}

const postsDirectory = path.join(process.cwd(), 'detail');

// Helper to convert filename to slug
function getSlugFromFilename(fileName: string): string {
  return fileName
    .replace(/\.(html|md)$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}

// Simple YAML frontmatter parser
function parseFrontmatter(fileContent: string): { data: Record<string, any>; content: string } {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  
  if (!match) {
    return { data: {}, content: fileContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  const lines = yamlBlock.split('\n');
  let currentKey = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for list items
    if (trimmed.startsWith('-') && currentKey) {
      const val = trimmed.substring(1).trim().replace(/^['"]|['"]$/g, '');
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(val);
      continue;
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value: any = trimmed.substring(colonIndex + 1).trim();

    // Clean value
    value = value.replace(/^['"]|['"]$/g, '');

    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (!isNaN(Number(value)) && value !== '') value = Number(value);

    currentKey = key;
    data[key] = value;
  }

  return { data, content };
}

// Extract date from vietnamese date string or ISO date string
function parseDateString(dateStr: string, fileDate: Date): { dateISO: string; displayStr: string } {
  if (!dateStr) {
    return {
      dateISO: fileDate.toISOString(),
      displayStr: fileDate.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
    };
  }

  // Look for DD/MM/YYYY
  const dmYMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (dmYMatch) {
    const [_, d, m, y] = dmYMatch;
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 12, 0, 0);
    return {
      dateISO: dateObj.toISOString(),
      displayStr: dateStr.trim(),
    };
  }

  // Look for YYYY-MM-DD
  const yMdMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (yMdMatch) {
    const [_, y, m, d] = yMdMatch;
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 12, 0, 0);
    return {
      dateISO: dateObj.toISOString(),
      displayStr: dateObj.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
    };
  }

  return {
    dateISO: new Date(dateStr).toString() !== 'Invalid Date' ? new Date(dateStr).toISOString() : fileDate.toISOString(),
    displayStr: dateStr.trim(),
  };
}

export function getSortedPostsData(): PostData[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.html') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = getSlugFromFilename(fileName);
      const filePath = path.join(postsDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const stat = fs.statSync(filePath);

      let title = fileName.replace(/\.(html|md)$/, '');
      let dateString = '';
      let dateISO = stat.mtime.toISOString();
      let tags: string[] = [];
      let contentHtml = '';
      let excerpt = '';
      const fileType = fileName.endsWith('.html') ? 'html' : 'md';

      if (fileType === 'html') {
        // Parse HTML
        const titleMatch = fileContent.match(/<title>([\s\S]*?)<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();

        const dateMatch = fileContent.match(/<(?:span|div|p)\s+[^>]*?class="date"[^>]*?>([\s\S]*?)<\/(?:span|div|p)>/i);
        if (dateMatch) dateString = dateMatch[1].trim();

        const parsedDate = parseDateString(dateString, stat.birthtime || stat.mtime);
        dateISO = parsedDate.dateISO;
        dateString = parsedDate.displayStr;

        const tagsMatch = fileContent.match(/<(?:span|div|p)\s+[^>]*?class="tags"[^>]*?>([\s\S]*?)<\/(?:span|div|p)>/i);
        if (tagsMatch) {
          const tagsStr = tagsMatch[1].trim();
          tags = tagsStr.match(/#([a-zA-Z0-9_\-]+)/g)?.map((t) => t.replace('#', '')) || [];
        }

        const mainMatch = fileContent.match(/<main>([\s\S]*?)<\/main>/i);
        const bodyMatch = fileContent.match(/<body[^>]*?>([\s\S]*?)<\/body>/i);
        
        if (mainMatch) {
          contentHtml = mainMatch[1].trim();
        } else if (bodyMatch) {
          // If no main, get body content and try to remove headers
          let bodyContent = bodyMatch[1].trim();
          bodyContent = bodyContent.replace(/<header>[\s\S]*?<\/header>/i, '');
          contentHtml = bodyContent;
        } else {
          contentHtml = fileContent;
        }

        // Clean excerpt
        const plainText = contentHtml.replace(/<[^>]*>/g, ' ');
        excerpt = plainText.substring(0, 160).trim() + '...';

      } else {
        // Parse MD
        const { data, content } = parseFrontmatter(fileContent);
        title = data.title || title;
        
        const rawDate = data.date ? String(data.date) : '';
        const parsedDate = parseDateString(rawDate, stat.birthtime || stat.mtime);
        dateISO = parsedDate.dateISO;
        dateString = parsedDate.displayStr;

        if (Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (typeof data.tags === 'string') {
          tags = data.tags.split(',').map((t: string) => t.trim());
        }

        contentHtml = marked.parse(content) as string;
        
        const plainText = content.replace(/[#*`_\[\]]/g, ' ');
        excerpt = plainText.substring(0, 160).trim() + '...';
      }

      return {
        slug,
        title,
        dateString,
        date: dateISO,
        tags,
        excerpt,
        contentHtml,
        fileType,
      };
    });

  // Sort posts by date descending
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string): PostData | null {
  const posts = getSortedPostsData();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}
