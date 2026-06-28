import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/http/errors";
import { withApiRoute } from "@/lib/http/route-handler";
import type { NextRequest } from "next/server";

function createRequest(method = "GET") {
  return {
    method,
    headers: new Headers(),
    nextUrl: new URL("http://localhost:3000/api/test"),
  } as unknown as NextRequest;
}

describe("route handler wrapper", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("converts application errors into standardized responses", async () => {
    const handler = withApiRoute(async () => {
      throw new AuthorizationError("Denied.");
    });

    const response = await handler(createRequest(), {
      params: Promise.resolve({}),
    });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toMatchObject({
      status: "error",
      errorCode: "FORBIDDEN",
      message: "Denied.",
    });
  });

  it("returns successful handler output unchanged", async () => {
    const handler = withApiRoute(async () => {
      return NextResponse.json({ status: "ok" }, { status: 200 });
    });

    const response = await handler(createRequest(), {
      params: Promise.resolve({}),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });

  it("adds retry-after headers to rate limited responses", async () => {
    const key = `route-limit:${Date.now()}`;
    const handler = withApiRoute(
      async () => NextResponse.json({ status: "ok" }, { status: 200 }),
      {
        rateLimit: {
          key,
          limit: 1,
          windowMs: 60_000,
          message: "Slow down.",
        },
      },
    );

    const firstResponse = await handler(createRequest(), {
      params: Promise.resolve({}),
    });
    const secondResponse = await handler(createRequest(), {
      params: Promise.resolve({}),
    });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(429);
    expect(secondResponse.headers.get("Retry-After")).toBeTruthy();
  });
});
