export const appRoleCodes = [
  "administrator",
  "coach",
  "parent",
  "artist",
] as const;

export const permissionCodes = [
  "auth:read",
  "auth:write",
  "users:read",
  "users:write",
  "roles:read",
  "roles:write",
  "artists:read",
  "artists:write",
  "activities:read",
  "activities:write",
  "attendance:read",
  "attendance:write",
  "performance:read",
  "performance:write",
  "injuries:read",
  "injuries:write",
  "medical:read",
  "medical:write",
  "reports:read",
  "reports:write",
  "audit:read",
  "settings:read",
  "settings:write",
  "notifications:read",
  "notifications:write",
  "profile:read",
  "profile:write",
] as const;

export type AppRoleCode = (typeof appRoleCodes)[number];
export type PermissionCode = (typeof permissionCodes)[number];

export type RolePermissionMatrix = Record<AppRoleCode, readonly PermissionCode[]>;
