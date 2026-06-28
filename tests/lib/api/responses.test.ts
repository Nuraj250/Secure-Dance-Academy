import { errorResponse, successResponse } from "@/lib/api/responses";

describe("API response helpers", () => {
  it("builds a success response with no-store headers", async () => {
    const response = successResponse("Loaded.", { ok: true });
    const body = await response.json();

    expect(body).toMatchObject({
      status: "success",
      message: "Loaded.",
      data: { ok: true },
    });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });

  it("builds an error response with validation details", async () => {
    const response = errorResponse(
      "VALIDATION_ERROR",
      "Invalid payload.",
      422,
      { fieldErrors: { email: ["Required"] } },
    );
    const body = await response.json();

    expect(body).toMatchObject({
      status: "error",
      errorCode: "VALIDATION_ERROR",
      message: "Invalid payload.",
    });
    expect(body.validationDetails).toEqual({
      fieldErrors: { email: ["Required"] },
    });
  });
});
