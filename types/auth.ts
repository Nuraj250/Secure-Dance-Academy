import type { AppRoleCode, PermissionCode } from "@/types/rbac";

export type SupabaseIdentity = {
  id: string;
  email: string | null;
  appMetadata: Record<string, unknown>;
  userMetadata: Record<string, unknown>;
  createdAt: string;
  lastSignInAt: string | null;
};

export type AuthUserStatus =
  | "anonymous"
  | "pending"
  | "active"
  | "suspended"
  | "disabled"
  | "archived";

export type SessionUser = {
  id: string;
  supabaseUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string | null;
  status: AuthUserStatus;
  locale: string | null;
  timezone: string | null;
  roles: AppRoleCode[];
  primaryRole: AppRoleCode | null;
  permissions: PermissionCode[];
  lastLoginAt: string | null;
  version: number;
};

export type SessionContext = {
  requestId: string;
  ipAddress: string | null;
  userAgent: string | null;
  origin: string | null;
  supabaseIdentity: SupabaseIdentity | null;
  user: SessionUser | null;
  isAuthenticated: boolean;
};

export type SignInCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type PasswordRecoveryRequest = {
  email: string;
};

export type PasswordResetPayload = {
  password: string;
  confirmPassword: string;
};

export type AuthActionResult<TData = void> =
  | {
      success: true;
      message: string;
      data?: TData;
    }
  | {
      success: false;
      message: string;
      errorCode: string;
      validationDetails?: Record<string, unknown>;
    };
