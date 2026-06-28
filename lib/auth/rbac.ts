import { appRoleCodes, permissionCodes, type AppRoleCode, type PermissionCode, type RolePermissionMatrix } from "@/types/rbac";

export const rolePermissionMatrix: RolePermissionMatrix = {
  administrator: permissionCodes,
  coach: [
    "auth:read",
    "artists:read",
    "activities:read",
    "attendance:read",
    "attendance:write",
    "performance:read",
    "performance:write",
    "injuries:read",
    "medical:read",
    "reports:read",
    "notifications:read",
    "profile:read",
    "profile:write",
  ],
  parent: [
    "auth:read",
    "artists:read",
    "activities:read",
    "attendance:read",
    "performance:read",
    "injuries:read",
    "medical:read",
    "reports:read",
    "notifications:read",
    "profile:read",
    "profile:write",
  ],
  artist: [
    "auth:read",
    "artists:read",
    "attendance:read",
    "performance:read",
    "injuries:read",
    "medical:read",
    "notifications:read",
    "profile:read",
    "profile:write",
  ],
};

const rolePriority: AppRoleCode[] = [
  "administrator",
  "coach",
  "parent",
  "artist",
];

export function isRoleCode(value: string): value is AppRoleCode {
  return appRoleCodes.includes(value as AppRoleCode);
}

export function pickPrimaryRole(roles: readonly AppRoleCode[]) {
  return (
    rolePriority.find((role) => roles.includes(role)) ??
    roles[0] ??
    null
  );
}

export function getPermissionsForRoles(roles: readonly AppRoleCode[]) {
  const uniquePermissions = new Set<PermissionCode>();

  for (const role of roles) {
    for (const permission of rolePermissionMatrix[role] ?? []) {
      uniquePermissions.add(permission);
    }
  }

  return [...uniquePermissions];
}

export function hasPermission(
  roles: readonly AppRoleCode[],
  permission: PermissionCode,
) {
  return getPermissionsForRoles(roles).includes(permission);
}

export function hasAnyRole(
  roles: readonly AppRoleCode[],
  allowedRoles: readonly AppRoleCode[],
) {
  return allowedRoles.some((role) => roles.includes(role));
}
