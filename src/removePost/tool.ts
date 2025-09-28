/**
 * Delete a post from BAND.
 * @see https://developers.band.us/develop/guide/api/remove_post
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "remove_post",
  description: "Delete a post from BAND.",
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
        description: "post identifier to delete",
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
          message: {
            type: "string",
            description: "Result message",
          },
        },
      },
    },
    required: ["result_code", "result_data"],
  },
};

interface RemovePostResponse {
  result_code: number;
  result_data: {
    message: string;
  };
}

export async function handleToolCall(band_key: string, post_key: string) {
  try {
    const params: Record<string, unknown> = { band_key, post_key };
    const deleteData = await bandApiClient.post<RemovePostResponse>(
      "/v2/band/post/remove",
      params
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(deleteData, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Failed to delete post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
