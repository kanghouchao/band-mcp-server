/**
 * Get posts from a specific band.
 * @see https://developers.band.us/develop/guide/api/get_posts
 */
import { bandApiClient } from "../client.js";
import { parseBandUrl } from "../url.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "get_posts",
  description: "Get posts from a specific band in BAND.",
  inputSchema: {
    type: "object",
    properties: {
      band_key: {
        type: "string",
        title: "Band Key",
        description: "band identifier",
      },
      locale: {
        type: "string",
        default: "ja_JP",
        title: "Locale",
        description: "Region and language",
      },
      after: {
        type: "string",
        title: "After",
        description: "for paging",
      },
      limit: {
        type: "number",
        title: "Limit",
        default: 20,
        description: "number of posts to load. min: 1, max: 100, default: 20",
      },
      url: {
        type: "string",
        title: "Band URL",
        description:
          "Full BAND URL to the band page (e.g., https://band.us/band/{band_key}).",
      },
    },
    anyOf: [
      { required: ["band_key"] },
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
            properties: {
              previous_params: {
                type: ["object", "null"],
                description: "Previous page parameters",
              },
              next_params: {
                type: ["object", "null"],
                description: "Next page parameters",
              },
            },
          },
          items: {
            type: "array",
            description: "List of posts",
            items: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "post content",
                },
                post_key: {
                  type: "string",
                  description: "post identifier",
                },
                created_at: {
                  type: "number",
                  description: "created time",
                },
                photos: {
                  type: "array",
                  description: "post photos",
                  items: {
                    type: "object",
                    properties: {
                      width: {
                        type: "number",
                        description: "photo width",
                      },
                      height: {
                        type: "number",
                        description: "photo height",
                      },
                      photo_key: {
                        type: "string",
                        description: "photo identifier",
                      },
                      photo_album_key: {
                        type: ["string", "null"],
                        description: "photo album identifier",
                      },
                      author: {
                        type: "object",
                        description: "photo author",
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
                      url: {
                        type: "string",
                        description: "photo url",
                      },
                      comment_count: {
                        type: "number",
                        description: "photo comment count",
                      },
                      emotion_count: {
                        type: "number",
                        description: "photo emotion count",
                      },
                      created_at: {
                        type: "number",
                        description: "photo created time",
                      },
                      is_video_thumbnail: {
                        type: "boolean",
                        description: "is video thumbnail",
                      },
                    },
                  },
                },
                comment_count: {
                  type: "number",
                  description: "post comment count",
                },
                author: {
                  type: "object",
                  description: "post author",
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

import type { Post, PagingParams } from "../types/api.js";

interface PostsResponse {
  result_code: number;
  result_data: {
    paging: PagingParams;
    items: Post[];
  };
}

export async function handleToolCall(
  band_key: string | undefined,
  locale?: string,
  after?: string,
  limit?: number,
  url?: string
) {
  let resolvedBandKey = band_key ? band_key.trim() : undefined;
  if ((!resolvedBandKey || resolvedBandKey.length === 0) && url) {
    const parsed = parseBandUrl(url);
    resolvedBandKey = parsed.bandKey;
  }

  if (!resolvedBandKey) {
    throw new Error("Either band_key or a valid BAND url must be provided.");
  }

  const resolvedLocale = locale && locale.trim().length > 0 ? locale : "ja_JP";

  const params: Record<string, unknown> = {
    band_key: resolvedBandKey,
    locale: resolvedLocale,
  };
  if (after) (params as Record<string, unknown>).after = after;
  if (limit) (params as Record<string, unknown>).limit = limit;

  const postsData = await bandApiClient.get<PostsResponse>(
    "/v2/band/posts",
    params
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(postsData, null, 2),
      },
    ],
  };
}
