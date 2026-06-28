import {
  sanitizeEmail,
  sanitizeNullableText,
  sanitizeSearchText,
  sanitizeText,
} from "@/lib/security/sanitize";

describe("sanitizers", () => {
  it("normalizes text and removes control characters", () => {
    expect(sanitizeText("  Dance\u0000 Academy \n")).toBe("Dance Academy");
  });

  it("normalizes nullable text", () => {
    expect(sanitizeNullableText("   ")).toBeNull();
    expect(sanitizeNullableText("  Hello  ")).toBe("Hello");
  });

  it("sanitizes email and search text", () => {
    expect(sanitizeEmail("  Test@Example.COM  ")).toBe("test@example.com");
    expect(sanitizeSearchText("<script>Dance</script>")).toBe("scriptDance/script");
  });
});
