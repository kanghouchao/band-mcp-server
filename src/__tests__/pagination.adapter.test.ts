import { emulatePagination, encodeCursor } from "../pagination/adapter";

describe("emulatePagination", () => {
  test("empty items returns empty page and no cursor", () => {
    const res = emulatePagination([], undefined, 10);
    expect(res.pageItems).toEqual([]);
    expect(res.nextCursor).toBeNull();
  });

  test("returns first page and nextCursor when more items exist", () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);
    const res = emulatePagination(items, undefined, 10);
    expect(res.pageItems.length).toBe(10);
    expect(res.pageItems[0]).toBe(1);
    expect(res.nextCursor).toBeTruthy();
  });

  test("invalid cursor falls back to offset 0", () => {
    const items = [1, 2, 3, 4, 5];
    const res = emulatePagination(items, "not-a-valid-cursor", 2);
    expect(res.pageItems).toEqual([1, 2]);
    expect(res.nextCursor).toBeTruthy();
  });

  test("cursor at end returns empty page and no nextCursor", () => {
    const items = [1, 2, 3];
    const cursor = encodeCursor({ offset: 3 });
    const res = emulatePagination(items, cursor, 5);
    expect(res.pageItems).toEqual([]);
    expect(res.nextCursor).toBeNull();
  });

  test("throws when upstream exceeds maxUpstream", () => {
    const items = Array.from({ length: 300 }, (_, i) => i);
    expect(() => emulatePagination(items, undefined, 10, 200)).toThrow(
      /exceeding maxUpstream/
    );
  });
});
