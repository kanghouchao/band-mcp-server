import { BandUrlParseError, parseBandUrl } from "../url.js";

describe("parseBandUrl", () => {
  it("extracts band key from band page url", () => {
    const result = parseBandUrl("https://band.us/band/AzIEz54gxWeSAB_nwygZ95");
    expect(result).toEqual({ bandKey: "AzIEz54gxWeSAB_nwygZ95" });
  });

  it("extracts post and comment identifiers", () => {
    const result = parseBandUrl(
      "https://band.us/band/AAAbBbMeQHBLh3-y8xxogqBg/post/AAAFJEEalAmkhLXGh0rQCy3h?commentId=AADGZXHAFeWdd1NaGsc5hN07",
    );

    expect(result).toEqual({
      bandKey: "AAAbBbMeQHBLh3-y8xxogqBg",
      postKey: "AAAFJEEalAmkhLXGh0rQCy3h",
      commentKey: "AADGZXHAFeWdd1NaGsc5hN07",
    });
  });

  it("supports alternate comment query parameters", () => {
    const result = parseBandUrl(
      "https://band.us/band/key/post/post?comment_key=COMMENT123",
    );

    expect(result.commentKey).toBe("COMMENT123");
  });

  it("throws for non band domains", () => {
    expect(() => parseBandUrl("https://example.com/band/abc")).toThrow(BandUrlParseError);
  });

  it("throws when band key is missing", () => {
    expect(() => parseBandUrl("https://band.us/")).toThrow(BandUrlParseError);
  });
});
