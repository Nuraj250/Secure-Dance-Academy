import { assertSameOriginRequest } from "@/lib/security/csrf";
import { CsrfError } from "@/lib/http/errors";
import type { NextRequest } from "next/server";

function createRequest(origin: string | null) {
  return {
    headers: new Headers(origin ? { origin } : {}),
  } as unknown as NextRequest;
}

describe("CSRF protection", () => {
  it("allows same-origin requests", () => {
    expect(() =>
      assertSameOriginRequest(
        createRequest("http://localhost:3000"),
        "http://localhost:3000",
      ),
    ).not.toThrow();
  });

  it("rejects cross-origin requests", () => {
    expect(() =>
      assertSameOriginRequest(
        createRequest("https://example.com"),
        "http://localhost:3000",
      ),
    ).toThrow(CsrfError);
  });

  it("rejects malformed or missing origins", () => {
    expect(() =>
      assertSameOriginRequest(
        createRequest("not-a-url"),
        "http://localhost:3000",
      ),
    ).toThrow(CsrfError);
    expect(() =>
      assertSameOriginRequest(createRequest(null), "http://localhost:3000"),
    ).toThrow(CsrfError);
  });
});
