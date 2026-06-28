import { z } from "zod";
import { assertValidInput, validateRequest } from "@/lib/validation/request";
import { ValidationError } from "@/lib/http/errors";

describe("request validation helpers", () => {
  const schema = z.object({
    email: z.string().email(),
    page: z.coerce.number().int().min(1),
  });

  it("parses valid input", () => {
    const result = validateRequest(schema, {
      email: "artist@example.com",
      page: "2",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ email: "artist@example.com", page: 2 });
    }
  });

  it("throws a validation error for invalid input", () => {
    expect(() =>
      assertValidInput(schema, { email: "not-an-email" }),
    ).toThrow(ValidationError);
  });
});
