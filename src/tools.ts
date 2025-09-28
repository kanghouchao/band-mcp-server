import { Tool } from "@modelcontextprotocol/sdk/types.js";
import profile from "./profile/index.js";
import bands from "./bands/index.js";
import posts from "./posts/index.js";
import post from "./post/index.js";
import comments from "./comments/index.js";
import permissions from "./permissions/index.js";
import albums from "./albums/index.js";
import photos from "./photos/index.js";
import writeComment from "./writeComment/index.js";
import writePost from "./writePost/index.js";
import removePost from "./removePost/index.js";
import removeComment from "./removeComment/index.js";

export const bandTools: Tool[] = [
  profile.ToolDefinition,
  bands.ToolDefinition,
  posts.ToolDefinition,
  post.ToolDefinition,
  comments.ToolDefinition,
  permissions.ToolDefinition,
  albums.ToolDefinition,
  photos.ToolDefinition,
  writeComment.ToolDefinition,
  writePost.ToolDefinition,
  removePost.ToolDefinition,
  removeComment.ToolDefinition,
];

export function handleToolCall(name: string, args: unknown) {
  try {
    const a = args as Record<string, unknown>;
    switch (name) {
      case "get_user_information":
        return profile.handleToolCall(a.band_key as string | undefined);
      case "get_bands":
        return bands.handleToolCall();
      case "get_posts":
        return posts.handleToolCall(
          a.band_key as string | undefined,
          a.locale as string | undefined,
          a.after as string | undefined,
          a.limit as number | undefined,
          a.url as string | undefined
        );
      case "get_post":
        return post.handleToolCall(a.band_key as string, a.post_key as string);
      case "get_comments":
        return comments.handleToolCall(
          a.band_key as string | undefined,
          a.post_key as string | undefined,
          a.sort as string | undefined,
          a.url as string | undefined
        );
      case "permissions":
        return permissions.handleToolCall(
          a.band_key as string,
          a.permissions as string
        );
      case "get_albums":
        return albums.handleToolCall(a.band_key as string);
      case "get_photos":
        return photos.handleToolCall(
          a.band_key as string,
          a.photo_album_key as string | undefined
        );
      case "write_comment":
        return writeComment.handleToolCall(
          a.band_key as string,
          a.post_key as string,
          a.body as string
        );
      case "write_post":
        return writePost.handleToolCall(
          a.band_key as string,
          a.content as string,
          a.do_push as boolean | undefined
        );
      case "remove_post":
        return removePost.handleToolCall(
          a.band_key as string,
          a.post_key as string
        );
      case "remove_comment":
        return removeComment.handleToolCall(
          a.band_key as string,
          a.post_key as string,
          a.comment_key as string
        );
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to get user information",
            },
            null,
            2
          ),
        },
      ],
    };
  }
}
