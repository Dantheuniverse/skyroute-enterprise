// Cloudflare Pages Function handling GET and POST requests for workpiece comments.
// Comments are stored in the `COMMENTS_KV` namespace defined in wrangler.toml.
import type { KVNamespace, PagesFunction } from '@cloudflare/workers-types';

/**
 * Represents the payload for a new comment submission.
 */
type CommentPayload = {
  /** The ID of the post the comment belongs to. */
  postId: string;
  /** The author of the comment (optional). */
  author?: string;
  /** The content of the comment. */
  content: string;
};

/**
 * Represents a comment as it is stored in the KV namespace.
 */
type StoredComment = {
  /** A unique identifier for the comment. */
  id: string;
  /** The ID of the post the comment belongs to. */
  postId: string;
  /** The author of the comment. */
  author: string;
  /** The content of the comment. */
  content: string;
  /** The date the comment was created, in ISO 8601 format. */
  createdAt: string;
};

/**
 * Defines the environment variables and bindings available to the function.
 */
interface Env {
  /** The KV namespace for storing comments. */
  COMMENTS_KV: KVNamespace;
}

/**
 * The time-to-live for a comment in the KV namespace, in seconds.
 */
const COMMENT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Builds the prefix for a comment in the KV namespace.
 * @param postId The ID of the post.
 * @returns The prefix for the comment.
 */
const buildPrefix = (postId: string) => `comments:${postId}:`;

/**
 * Builds the legacy key for a comment in the KV namespace.
 * @param postId The ID of the post.
 * @returns The legacy key for the comment.
 */
const buildLegacyKey = (postId: string) => `comments:${postId}`;

/**
 * Reads all comments for a given post from the KV namespace.
 * @param env The environment variables and bindings.
 * @param postId The ID of the post to read comments for.
 * @returns A promise that resolves to an array of comments.
 */
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

/**
 * Creates a JSON response.
 * @param data The data to send in the response.
 * @param init The response init options.
 * @returns A JSON response.
 */
const jsonResponse = (data: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    ...init
  });

/**
 * Handles GET requests to the /api/comments endpoint.
 * @param request The request object.
 * @param env The environment variables and bindings.
 * @returns A promise that resolves to a JSON response.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');

  if (!postId) {
    return jsonResponse({ error: 'Missing "postId" query parameter.' }, { status: 400 });
  }

  const comments = await readComments(env, postId);

  return jsonResponse({ postId, comments });
};

/**
 * Handles POST requests to the /api/comments endpoint.
 * @param request The request object.
 * @param env The environment variables and bindings.
 * @returns A promise that resolves to a JSON response.
 */
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
