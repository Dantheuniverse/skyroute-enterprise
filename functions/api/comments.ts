// Cloudflare Pages Function handling GET and POST requests for workpiece comments.
// Comments are stored in the `COMMENTS_KV` namespace defined in wrangler.toml.
import type { KVNamespace, PagesFunction } from '@cloudflare/workers-types';

type CommentPayload = {
  postId: string;
  author?: string;
  content: string;
};

type StoredComment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
};

interface Env {
  COMMENTS_KV: KVNamespace;
}

const COMMENT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const buildPrefix = (postId: string) => `comments:${postId}:`;
const buildLegacyKey = (postId: string) => `comments:${postId}`;

const readComments = async (env: Env, postId: string): Promise<StoredComment[]> => {
  const prefix = buildPrefix(postId);
  const list = await env.COMMENTS_KV.list({ prefix, limit: 1000 });

  const comments = await Promise.all(
    list.keys.map((entry) => env.COMMENTS_KV.get(entry.name, { type: 'json' }) as Promise<StoredComment | null>)
  );

  const filtered = comments.filter((value): value is StoredComment => Boolean(value));

  if (filtered.length > 0) {
    return filtered.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  // Backward compatibility: load legacy aggregated array if present.
  const legacy = (await env.COMMENTS_KV.get(buildLegacyKey(postId), { type: 'json' })) as StoredComment[] | null;
  if (Array.isArray(legacy)) {
    return legacy;
  }

  return [];
};

const jsonResponse = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    ...init
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');

  if (!postId) {
    return jsonResponse({ error: 'Missing "postId" query parameter.' }, { status: 400 });
  }

  const comments = await readComments(env, postId);

  return jsonResponse({ postId, comments });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: CommentPayload;

  try {
    payload = (await request.json()) as CommentPayload;
  } catch (error) {
    return jsonResponse({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const postId = payload.postId?.trim();
  const content = payload.content?.trim();
  const rawAuthor = payload.author?.toString().trim() ?? '';
  const author = rawAuthor.length === 0 ? 'Anonymous' : rawAuthor;

  if (!postId || !content) {
    return jsonResponse({ error: 'Both "postId" and "content" are required.' }, { status: 400 });
  }

  if (author !== 'Anonymous' && author.length < 2) {
    return jsonResponse({ error: 'Author name must contain at least 2 characters.' }, { status: 422 });
  }

  if (content.length > 2000) {
    return jsonResponse({ error: 'Comment content is too long.' }, { status: 422 });
  }

  const now = new Date().toISOString();
  const newComment: StoredComment = {
    id: crypto.randomUUID(),
    postId,
    author,
    content,
    createdAt: now
  };

  const storageKey = `${buildPrefix(postId)}${newComment.id}`;
  await env.COMMENTS_KV.put(storageKey, JSON.stringify(newComment), {
    expirationTtl: COMMENT_TTL_SECONDS
  });

  // Remove legacy aggregated entry if it exists to avoid future inconsistencies.
  await env.COMMENTS_KV.delete(buildLegacyKey(postId));

  return jsonResponse({ postId, comment: newComment }, { status: 201 });
};
