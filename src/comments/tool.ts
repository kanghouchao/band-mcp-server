/**
 * Get comments from a specific post.
 * @see https://developers.band.us/develop/guide/api/get_comments
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { parseBandUrl } from "../url.js";

export const ToolDefinition: Tool = {
  name: "get_comments",
  description: "Get comments from a specific post in BAND.",
  inputSchema: {
    type: "object",
    properties: {
      band_key: {
        type: "string",
        title: "Band Key",
        description: "band identifier",
      },
      post_key: {
        type: "string",
        title: "Post Key",
        description: "post identifier",
      },
      sort: {
        type: "string",
        title: "Sort",
        description: "sort order for comments",
      },
      url: {
        type: "string",
        title: "Comment URL",
        description:
          "Full BAND URL to the post or comment (e.g., https://band.us/band/{band_key}/post/{post_key}?commentId={comment_key}).",
      },
    },
    anyOf: [
      { required: ["band_key", "post_key"] },
      { required: ["url"] },
    ],
  },
  outputSchema: {
    type: "object",
    properties: {
      result_code: {
        type: "number",
        description: "Result code",
      },
      result_data: {
        type: "object",
        description: "Result data",
        properties: {
          paging: {
            type: "object",
            description: "Paging information",
          },
          items: {
            type: "array",
            description: "List of comments",
            items: {
              type: "object",
              properties: {
                comment_key: {
                  type: "string",
                  description: "comment identifier",
                },
                content: {
                  type: "string",
                  description: "comment content",
                },
                created_at: {
                  type: "number",
                  description: "comment created time",
                },
                author: {
                  type: "object",
                  description: "comment author",
                  properties: {
                    name: {
                      type: "string",
                      description: "author name",
                    },
                    description: {
                      type: "string",
                      description: "author description",
                    },
                    profile_image_url: {
                      type: "string",
                      description: "author profile image url",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    required: ["result_code", "result_data"],
  },
};

import type { PagingParams } from "../types/api.js";

interface CommentItem {
  comment_key: string;
  content: string;
  created_at: number;
  author: {
    name: string;
    description: string;
    profile_image_url: string;
  };
}

interface CommentsResponse {
  paging: PagingParams;
  items: CommentItem[];
}

export async function handleToolCall(
  band_key: string | undefined,
  post_key: string | undefined,
  sort?: string,
  url?: string
) {
  let resolvedBandKey = band_key ? band_key.trim() : undefined;
  let resolvedPostKey = post_key ? post_key.trim() : undefined;
  let targetCommentKey: string | undefined;

  if (url) {
    const parsed = parseBandUrl(url);
    if (!resolvedBandKey) resolvedBandKey = parsed.bandKey;
    if (!resolvedPostKey) resolvedPostKey = parsed.postKey;
    targetCommentKey = parsed.commentKey;
  }

  if (!resolvedBandKey || !resolvedPostKey) {
    throw new Error(
      "band_key and post_key are required unless a valid BAND url is provided.",
    );
  }

  const params: Record<string, unknown> = { band_key: resolvedBandKey, post_key: resolvedPostKey };
  if (sort) params.sort = sort;

  const commentsData = await bandApiClient.get<CommentsResponse>(
    "/v2/band/post/comments",
    params
  );
  let payload = commentsData;

  if (targetCommentKey) {
    const matched = commentsData.items.filter(
      (item) => item.comment_key === targetCommentKey,
    );

    if (matched.length === 0) {
      throw new Error(
        `Comment ${targetCommentKey} was not found in the retrieved page. Try fetching the comments without filtering or adjust pagination.`,
      );
    }

    payload = {
      ...commentsData,
      items: matched,
    };
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}
