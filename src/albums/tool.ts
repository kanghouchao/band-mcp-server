/**
 * Get photo albums from a specific band.
 * @see https://developers.band.us/develop/guide/api/get_albums
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "get_albums",
  description: "Get photo albums from a specific band in BAND.",
  inputSchema: {
    type: "object",
    properties: {
      band_key: {
        type: "string",
        title: "Band ID",
        description: "band ID",
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
            description: "List of photo albums",
            items: {
              type: "object",
              properties: {
                photo_album_key: {
                  type: "string",
                  description: "photo album identifier",
                },
                name: {
                  type: "string",
                  description: "album name",
                },
                photo_count: {
                  type: "number",
                  description: "number of photos in album",
                },
                cover_photo: {
                  type: "object",
                  description: "album cover photo information",
                },
                created_at: {
                  type: "number",
                  description: "album created time",
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

interface Paging {
  previous_params: Record<string, unknown> | null;
  next_params: Record<string, unknown> | null;
}

interface AlbumItem {
  photo_album_key: string;
  name: string;
  photo_count: number;
  cover_photo: Record<string, unknown> | null;
  created_at: number;
}

interface AlbumsResponse {
  result_code: number;
  result_data: {
    paging: Paging;
    items: AlbumItem[];
  };
}

export async function handleToolCall(band_key: string) {
  const albumsData = await bandApiClient.get<AlbumsResponse>(
    "/v2/band/albums",
    { band_key }
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(albumsData, null, 2),
      },
    ],
  };
}
