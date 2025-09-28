import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

let handleToolCall: typeof import("../posts/tool.js")["handleToolCall"];
let bandApiClient: typeof import("../client.js")["bandApiClient"];

beforeAll(async () => {
  ({ handleToolCall } = await import("../posts/tool.js"));
  ({ bandApiClient } = await import("../client.js"));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("posts tool handleToolCall", () => {
  it("derives band key from url when band_key missing", async () => {
    const getMock = jest
      .spyOn(bandApiClient, "get")
      .mockResolvedValue({
        paging: { previous_params: null, next_params: null },
        items: [],
      } as never);

    await handleToolCall(
      undefined,
      undefined,
      undefined,
      undefined,
      "https://band.us/band/AAAbBbMeQHBLh3-y8xxogqBg"
    );

    expect(getMock).toHaveBeenCalledWith(
      "/v2/band/posts",
      { band_key: "AAAbBbMeQHBLh3-y8xxogqBg", locale: "ja_JP" }
    );
  });

  it("respects user provided locale and trims identifiers", async () => {
    const getMock = jest
      .spyOn(bandApiClient, "get")
      .mockResolvedValue({
        paging: { previous_params: null, next_params: null },
        items: [],
      } as never);

    await handleToolCall(
      "  SOME_KEY  ",
      "en_US",
      undefined,
      50,
      undefined
    );

    expect(getMock).toHaveBeenCalledWith(
      "/v2/band/posts",
      { band_key: "SOME_KEY", locale: "en_US", limit: 50 }
    );
  });

  it("throws when neither band_key nor url provided", async () => {
    await expect(
      handleToolCall(undefined, undefined)
    ).rejects.toThrow("Either band_key or a valid BAND url must be provided.");
  });
});
