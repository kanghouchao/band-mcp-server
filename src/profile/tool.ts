/**
 * Get user profile information from BAND.
 * @see https://developers.band.us/develop/guide/api/get_user_information
 */
import { bandApiClient } from "../client.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ToolDefinition: Tool = {
  name: "get_user_information",
  description:
    "Get user profile information from BAND. Optionally specify a band_key to get user info within a specific band context.",
  inputSchema: {
    type: "object",
    properties: {
      band_key: {
        type: "string",
        title: "Band Key",
        description:
          "Band ID to get the user's profile from a specific band. If not provided, the default profile of the user will be returned.",
      },
    },
    required: [],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        description: "Indicates if the operation was successful.",
      },
      data: {
        type: "object",
        description: "User profile data returned from BAND API.",
        properties: {
          user_key: {
            type: "string",
            description: "User ID.",
          },
          name: {
            type: "string",
            description: "User's name.",
          },
          profile_image_url: {
            type: "string",
            description: "URL of a profile image.",
          },
          is_app_member: {
            type: "boolean",
            description:
              "Boolean value indicating whether the user account is connected to your app or not.",
          },
          message_allowed: {
            type: "boolean",
            description:
              "Boolean value indicating whether the user allowed to receive messages or not.",
          },
        },
      },
    },
    required: ["success", "data"],
  },
};

interface BandUserProfile {
  name: string;
  profile_image_url?: string;
  is_app_member: boolean;
  message_allowed: boolean;
}

export async function handleToolCall(band_key?: string) {
  const params: Record<string, unknown> = {};
  if (band_key) (params as Record<string, unknown>).band_key = band_key;
  const profile = await bandApiClient.get<BandUserProfile>(
    "/v2/profile",
    params
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(profile, null, 2),
      },
    ],
  };
}
