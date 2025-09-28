/**
 * Write a post to BAND.
 * @see https://developers.band.us/develop/guide/api/write_post
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "write_post",
  description: "Write a post to BAND.",
  inputSchema: {
    type: "object",
    properties: {
      band_key: {
        type: "string",
        title: "Band Key",
        description: "band identifier",
      },
      content: {
        type: "string",
        title: "Content",
        description: "post content",
      },
      do_push: {
        type: "boolean",
        title: "Do Push",
        description: "whether to send push notification",
      },
    },
    required: ["band_key", "content"],
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
          post_key: {
            type: "string",
            description: "created post identifier",
          },
        },
      },
    },
    required: ["result_code", "result_data"],
  },
};

interface WritePostResponse {
  result_code: number;
  result_data: {
    post_key: string;
  };
}

export async function handleToolCall(
  band_key: string,
  content: string,
  do_push?: boolean
) {
  const params: Record<string, unknown> = { band_key, content };
  if (do_push !== undefined)
    (params as Record<string, unknown>).do_push = do_push;
  const postData = await bandApiClient.post<WritePostResponse>(
    "/v2.2/band/post/create",
    params
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(postData, null, 2),
      },
    ],
  };
}
