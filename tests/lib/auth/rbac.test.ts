import {
  getPermissionsForRoles,
  hasAnyRole,
  hasPermission,
  pickPrimaryRole,
} from "@/lib/auth/rbac";

describe("RBAC helpers", () => {
  it("returns the highest priority role as primary", () => {
    expect(pickPrimaryRole(["artist", "coach"])).toBe("coach");
    expect(pickPrimaryRole(["parent", "artist"])).toBe("parent");
  });

  it("merges permissions from multiple roles", () => {
    const permissions = getPermissionsForRoles(["parent", "coach"]);

    expect(permissions).toContain("attendance:read");
    expect(permissions).toContain("performance:write");
    expect(permissions).not.toContain("users:write");
  });

  it("checks permissions and role membership", () => {
    expect(hasPermission(["administrator"], "users:write")).toBe(true);
    expect(hasPermission(["artist"], "users:write")).toBe(false);
    expect(hasAnyRole(["artist", "parent"], ["coach", "parent"])).toBe(true);
  });
});
