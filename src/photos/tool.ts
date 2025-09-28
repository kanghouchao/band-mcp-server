/**
 * Get photos from a specific album.
 * @see https://developers.band.us/develop/guide/api/get_photos
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "get_photos",
  description: "Get photos from a specific album in BAND.",
  inputSchema: {
    type: "object",
    properties: {
      band_key: {
        type: "string",
        title: "Band Key",
        description: "band identifier",
      },
      photo_album_key: {
        type: "string",
        title: "Photo Album Key",
        description: "photo album identifier",
      },
    },
    required: ["band_key"],
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
            description: "List of photos",
            items: {
              type: "object",
              properties: {
                photo_key: {
                  type: "string",
                  description: "photo identifier",
                },
                url: {
                  type: "string",
                  description: "photo url",
                },
                width: {
                  type: "number",
                  description: "photo width",
                },
                height: {
                  type: "number",
                  description: "photo height",
                },
                created_at: {
                  type: "number",
                  description: "photo created time",
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
              },
            },
          },
        },
      },
    },
    required: ["result_code", "result_data"],
  },
};

import type { Photo, PagingParams } from "../types/api.js";

interface PhotosResponse {
  result_code: number;
  result_data: {
    paging: PagingParams;
    items: Photo[];
  };
}

export async function handleToolCall(
  band_key: string,
  photo_album_key?: string
) {
  const params: Record<string, unknown> = { band_key };
  if (photo_album_key)
    (params as Record<string, unknown>).photo_album_key = photo_album_key;

  const photosData = await bandApiClient.get<PhotosResponse>(
    "/v2/band/album/photos",
    params
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(photosData, null, 2),
      },
    ],
  };
}
