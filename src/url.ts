const COMMENT_PARAM_KEYS = ["commentId", "comment_id", "commentKey", "comment_key"] as const;

export interface ParsedBandUrl {
  bandKey: string;
  postKey?: string;
  commentKey?: string;
}

export class BandUrlParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BandUrlParseError";
  }
}

function normalize(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseBandUrl(rawUrl: string): ParsedBandUrl {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch (error) {
    throw new BandUrlParseError(`Invalid URL: ${(error as Error).message}`);
  }

  const hostname = url.hostname.toLowerCase();
  if (!hostname.endsWith("band.us")) {
    throw new BandUrlParseError("URL must belong to band.us");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2 || segments[0] !== "band") {
    throw new BandUrlParseError("Unsupported BAND URL format: missing band key");
  }

  const bandKey = segments[1];
  if (!bandKey) {
    throw new BandUrlParseError("Band key was not found in the URL");
  }

  let postKey: string | undefined;
  if (segments.length >= 4 && segments[2] === "post") {
    postKey = segments[3];
  }

  let commentKey: string | undefined;
  for (const key of COMMENT_PARAM_KEYS) {
    const candidate = normalize(url.searchParams.get(key));
    if (candidate) {
      commentKey = candidate;
      break;
    }
  }

  const result: ParsedBandUrl = { bandKey };

  if (postKey) {
    result.postKey = postKey;
  }

  if (commentKey) {
    result.commentKey = commentKey;
  }

  return result;
}
