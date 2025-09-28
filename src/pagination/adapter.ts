/**
 * Server-side pagination emulator
 * - Exposes `emulatePagination(items, cursor, limit, maxUpstream)`
 * - Cursor is an opaque base64(json) containing { offset: number, seed?: string }
 * - If cursor invalid -> fallback to offset=0
 * - nextCursor is generated when there are remaining items
 */

export interface EmulatedPage<T> {
  pageItems: T[];
  nextCursor?: string | null;
}

export function encodeCursor(obj: unknown): string {
  try {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
  } catch {
    return "";
  }
}

export function decodeCursor(cursor?: string): Record<string, unknown> | null {
  if (!cursor) return null;
  try {
    const s = Buffer.from(cursor, "base64").toString("utf8");
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export function emulatePagination<T>(
  items: T[],
  cursor?: string,
  limit?: number,
  maxUpstream = 200
): EmulatedPage<T> {
  // Enforce max upstream size
  if (items.length > maxUpstream) {
    throw new Error(
      `Upstream returned too many items (${items.length}) exceeding maxUpstream=${maxUpstream}`
    );
  }

  const parsed = decodeCursor(cursor);
  let offset = 0;
  if (parsed && typeof parsed.offset === "number" && parsed.offset >= 0) {
    offset = parsed.offset;
  }

  const safeLimit =
    typeof limit === "number" && limit > 0 ? Math.min(limit, 100) : 20;

  const pageItems = items.slice(offset, offset + safeLimit);

  let nextCursor: string | null = null;
  if (offset + pageItems.length < items.length) {
    nextCursor = encodeCursor({
      offset: offset + pageItems.length,
      seed: Date.now(),
    });
  }

  return { pageItems, nextCursor };
}
