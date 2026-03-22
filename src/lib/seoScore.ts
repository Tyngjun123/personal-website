// src/lib/seoScore.ts

interface ArticleData {
  title: string;
  description: string;
  keywords?: string[];
  cover?: string;
  tags: string[];
  modifiedDate?: string;
}

interface SeoResult {
  score: number;
  issues: string[];
  breakdown: { field: string; points: number; max: number; ok: boolean }[];
}

export function scoreArticle(data: ArticleData): SeoResult {
  const issues: string[] = [];
  const breakdown: SeoResult['breakdown'] = [];

  // Title: 30–60 chars = 25 pts
  const titleLen = data.title.length;
  const titleOk = titleLen >= 30 && titleLen <= 60;
  if (!titleOk) issues.push(`Title is ${titleLen} chars (ideal: 30–60)`);
  breakdown.push({ field: 'Title length', points: titleOk ? 25 : 0, max: 25, ok: titleOk });

  // Description: 120–160 chars = 25 pts
  const descLen = data.description.length;
  const descOk = descLen >= 120 && descLen <= 160;
  if (!descOk) issues.push(`Description is ${descLen} chars (ideal: 120–160)`);
  breakdown.push({ field: 'Description length', points: descOk ? 25 : 0, max: 25, ok: descOk });

  // Keywords: ≥3 = 20 pts
  const kwOk = (data.keywords?.length ?? 0) >= 3;
  if (!kwOk) issues.push('Add at least 3 keywords');
  breakdown.push({ field: 'Keywords (≥3)', points: kwOk ? 20 : 0, max: 20, ok: kwOk });

  // Cover image = 20 pts
  const coverOk = !!data.cover;
  if (!coverOk) issues.push('Missing cover image');
  breakdown.push({ field: 'Cover image', points: coverOk ? 20 : 0, max: 20, ok: coverOk });

  // Tags ≥2 = 10 pts
  const tagsOk = data.tags.length >= 2;
  if (!tagsOk) issues.push('Add at least 2 tags');
  breakdown.push({ field: 'Tags (≥2)', points: tagsOk ? 10 : 0, max: 10, ok: tagsOk });

  const score = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score, issues, breakdown };
}

export function scoreBadge(score: number): { label: string; bg: string; color: string } {
  if (score >= 80) return { label: 'Good', bg: '#E1F5EE', color: '#0F6E56' };
  if (score >= 50) return { label: 'Okay', bg: '#FEF9EE', color: '#92400E' };
  return { label: 'Needs work', bg: '#FEE2E2', color: '#991B1B' };
}
