/**
 * Get comments from a specific post.
 * @see https://developers.band.us/develop/guide/api/get_comments
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

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
    },
    required: ["band_key", "post_key"],
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
  result_code: number;
  result_data: {
    paging: PagingParams;
    items: CommentItem[];
  };
}

export async function handleToolCall(
  band_key: string,
  post_key: string,
  sort?: string
) {
  const params: Record<string, unknown> = { band_key, post_key };
  if (sort) params.sort = sort;

  const commentsData = await bandApiClient.get<CommentsResponse>(
    "/v2/band/post/comments",
    params
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(commentsData, null, 2),
      },
    ],
  };
}
