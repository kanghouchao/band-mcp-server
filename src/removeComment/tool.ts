/**
 * Delete a comment from BAND.
 * @see https://developers.band.us/develop/guide/api/remove_comment
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "remove_comment",
  description: "Delete a comment from BAND.",
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
      comment_key: {
        type: "string",
        title: "Comment Key",
        description: "comment identifier to delete",
      },
    },
    required: ["band_key", "post_key", "comment_key"],
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

interface RemoveCommentResponse {
  result_code: number;
  result_data: {
    message: string;
  };
}

export async function handleToolCall(
  band_key: string,
  post_key: string,
  comment_key: string
) {
  try {
    const params: Record<string, unknown> = { band_key, post_key, comment_key };
    const deleteData = await bandApiClient.post<RemoveCommentResponse>(
      "/v2/band/post/comment/remove",
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
      `Failed to delete comment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
