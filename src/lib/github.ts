// src/lib/github.ts
// GitHub API client — reads/writes files to trigger Vercel auto-deploy

const API = 'https://api.github.com';

function cfg() {
  return {
    token:  process.env.GITHUB_TOKEN  ?? '',
    owner:  process.env.GITHUB_OWNER  ?? '',
    repo:   process.env.GITHUB_REPO   ?? '',
    branch: process.env.GITHUB_BRANCH ?? 'main',
  };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export function isConfigured(): boolean {
  const c = cfg();
  return !!(c.token && c.owner && c.repo);
}

export interface GHFile {
  content: string; // decoded UTF-8
  sha: string;
  name: string;
  path: string;
}

export interface GHEntry {
  name: string;
  path: string;
  sha:  string;
  type: 'file' | 'dir';
}

export async function getFile(path: string): Promise<GHFile> {
  const { token, owner, repo, branch } = cfg();
  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error(`GitHub getFile(${path}): ${res.status} ${res.statusText}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha:     data.sha,
    name:    data.name,
    path:    data.path,
  };
}

export async function saveFile(
  path: string,
  content: string,
  sha?: string,
  message?: string,
): Promise<void> {
  const { token, owner, repo, branch } = cfg();
  const body: Record<string, unknown> = {
    message: message ?? `CMS: update ${path}`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub saveFile(${path}): ${(err as any).message ?? res.statusText}`);
  }
}

export async function deleteFile(path: string, sha: string, message?: string): Promise<void> {
  const { token, owner, repo, branch } = cfg();
  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify({ message: message ?? `CMS: delete ${path}`, sha, branch }),
  });
  if (!res.ok) throw new Error(`GitHub deleteFile(${path}): ${res.statusText}`);
}

export async function listDir(path: string): Promise<GHEntry[]> {
  const { token, owner, repo, branch } = cfg();
  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
    headers: headers(token),
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((f: any) => ({ name: f.name, path: f.path, sha: f.sha, type: f.type }));
}

// ── Frontmatter helpers ───────────────────────────────────────────────────────

export function parseMdx(raw: string): { data: Record<string, any>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const [, yaml, body] = match;
  const data: Record<string, any> = {};

  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const raw = line.slice(colon + 1).trim();
    if (!key) continue;

    if (raw.startsWith('[')) {
      const inner = raw.slice(1, -1).trim();
      data[key] = inner
        ? inner.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
        : [];
    } else if (raw === 'true')  { data[key] = true;
    } else if (raw === 'false') { data[key] = false;
    } else if (raw !== '' && !isNaN(Number(raw))) { data[key] = Number(raw);
    } else { data[key] = raw.replace(/^["']|["']$/g, '');
    }
  }

  return { data, body: body.trim() };
}

export function buildMdx(data: Record<string, any>, body: string): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map(i => `"${i}"`).join(', ')}]`);
    } else if (typeof v === 'boolean') {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: "${String(v).replace(/"/g, '\\"')}"`);
    }
  }
  return `---\n${lines.join('\n')}\n---\n\n${body.trim()}\n`;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
