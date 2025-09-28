import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

let handleToolCall: typeof import("../comments/tool.js")["handleToolCall"];
let bandApiClient: typeof import("../client.js")["bandApiClient"];

beforeAll(async () => {
  ({ handleToolCall } = await import("../comments/tool.js"));
  ({ bandApiClient } = await import("../client.js"));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("comments tool handleToolCall", () => {
  it("derives identifiers from url and filters the target comment", async () => {
    const getMock = jest
      .spyOn(bandApiClient, "get")
      .mockResolvedValue({
        paging: { previous_params: null, next_params: null },
        items: [
          {
            comment_key: "AAA",
            content: "first",
            created_at: 0,
            author: { name: "a", description: "", profile_image_url: "" },
          },
          {
            comment_key: "TARGET",
            content: "target",
            created_at: 0,
            author: { name: "b", description: "", profile_image_url: "" },
          },
        ],
      } as never);

    const response = await handleToolCall(
      undefined,
      undefined,
      undefined,
      "https://band.us/band/BAND_KEY/post/POST_KEY?commentId=TARGET"
    );

    expect(getMock).toHaveBeenCalledWith(
      "/v2/band/post/comments",
      { band_key: "BAND_KEY", post_key: "POST_KEY" }
    );

    const payload = JSON.parse(response.content[0].text) as {
      items: Array<{ comment_key: string }>;
    };
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].comment_key).toBe("TARGET");
  });

  it("throws when requested comment is not found", async () => {
    jest
      .spyOn(bandApiClient, "get")
      .mockResolvedValue({
        paging: { previous_params: null, next_params: null },
        items: [],
      } as never);

    await expect(
      handleToolCall(
        undefined,
        undefined,
        undefined,
        "https://band.us/band/BAND/post/POST?commentId=MISSING"
      )
    ).rejects.toThrow(
      "Comment MISSING was not found in the retrieved page. Try fetching the comments without filtering or adjust pagination."
    );
  });

  it("throws when neither identifiers nor url provided", async () => {
    await expect(
      handleToolCall(undefined, undefined)
    ).rejects.toThrow(
      "band_key and post_key are required unless a valid BAND url is provided."
    );
  });
});
