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

const buildKey = (postId: string) => `comments:${postId}`;

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

  const comments = ((await env.COMMENTS_KV.get(buildKey(postId), { type: 'json' })) as StoredComment[] | null) ?? [];

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
  const author = payload.author?.toString().trim() || 'Anonymous';

  if (!postId || !content) {
    return jsonResponse({ error: 'Both "postId" and "content" are required.' }, { status: 400 });
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

  const key = buildKey(postId);
  const existingComments = ((await env.COMMENTS_KV.get(key, { type: 'json' })) as StoredComment[] | null) ?? [];
  const updated = [...existingComments, newComment];

  await env.COMMENTS_KV.put(key, JSON.stringify(updated), {
    expirationTtl: 60 * 60 * 24 * 30 // expire after 30 days; adjust as needed
  });

  return jsonResponse({ postId, comment: newComment }, { status: 201 });
};
