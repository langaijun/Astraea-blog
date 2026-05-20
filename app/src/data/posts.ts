export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  slug: string;
}

const STORAGE_KEY = 'farsight_posts';

let staticPosts: BlogPost[] | null = null;

// 读取服务器上的静态 posts.json
async function fetchStaticPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/posts.json');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// 统一读取：先读静态文件，再读 localStorage
export async function getPosts(): Promise<BlogPost[]> {
  if (staticPosts) return staticPosts;

  // 先读服务器静态文件
  const serverPosts = await fetchStaticPosts();
  if (serverPosts.length > 0) {
    staticPosts = serverPosts;
    return serverPosts;
  }

  // fallback: 本地编辑中的草稿
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }

  return [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.slug === slug);
}

// 管理后台用：读取本地编辑中的数据
export function getLocalPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export function saveLocalPosts(posts: BlogPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function deleteLocalPost(id: string) {
  const posts = getLocalPosts().filter(p => p.id !== id);
  saveLocalPosts(posts);
}

export function slugify(title: string): string {
  return title
    .replace(/\s+/g, '-')
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\-]/g, '')
    .substring(0, 60);
}

// 导出为 JSON 文件内容（管理后台点击导出时用）
export function exportToJSON(posts: BlogPost[]): string {
  return JSON.stringify(posts, null, 2);
}

// 摘要：取正文前 N 个字符
export function excerpt(content: string, maxLen: number = 120): string {
  const plain = content.replace(/\n/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return plain.substring(0, maxLen) + '...';
}
