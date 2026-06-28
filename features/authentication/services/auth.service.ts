import { withPrismaTransaction } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanitizeEmail } from "@/lib/security/sanitize";
import { createAuditEvent } from "@/lib/security/audit";
import { createRateLimitKey, enforceRateLimit } from "@/lib/security/rate-limit";
import {
  AccountPendingError,
  AuthenticationError,
  ServiceUnavailableError,
} from "@/lib/http/errors";
import { siteConfig } from "@/config/site";
import type { RequestContext } from "@/lib/http/request-context";
import {
  passwordRecoverySchema,
  passwordResetSchema,
  signInSchema,
  type PasswordRecoveryInput,
  type PasswordResetInput,
  type SignInInput,
} from "@/features/authentication/schemas/auth.schema";
import { SessionService } from "@/features/authentication/services/session.service";
import { AuditService } from "@/features/audit/services/audit.service";
import { UserRepository } from "@/features/users/repositories/user.repository";

export class AuthenticationService {
  constructor(
    private readonly sessionService = new SessionService(),
    private readonly userRepository = new UserRepository(),
    private readonly auditService = new AuditService(),
  ) {}

  async signIn(
    input: SignInInput,
    requestContext: RequestContext,
  ) {
    const parsedInput = signInSchema.parse(input);
    enforceRateLimit(
      createRateLimitKey("auth", "login", parsedInput.email),
      {
        limit: 5,
        windowMs: 15 * 60 * 1000,
      },
      "Too many sign-in attempts for this account. Please try again later.",
    );
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new AuthenticationError("Invalid email or password.");
    }

    const session = await this.sessionService.resolveSession(requestContext);
    const activeUser = session.user;

    if (!activeUser) {
      await this.auditService.record(
        createAuditEvent({
          actor: {
            userId: session.supabaseIdentity?.id ?? null,
            email: session.supabaseIdentity?.email ?? parsedInput.email,
            displayName: null,
            roleCode: "anonymous",
          },
          request: {
            requestId: requestContext.requestId,
            ipAddress: requestContext.ipAddress,
            userAgent: requestContext.userAgent,
            origin: requestContext.origin,
          },
          action: "auth.login",
          entity: {
            type: "auth_identity",
            id: session.supabaseIdentity?.id ?? parsedInput.email,
            label: session.supabaseIdentity?.email ?? parsedInput.email,
          },
          outcome: "DENIED",
        }),
      );
      await supabase.auth.signOut();
      throw new AccountPendingError(
        "An active academy profile is required before access is enabled.",
      );
    }

    if (activeUser.status !== "active") {
      await this.auditService.record(
        createAuditEvent({
          actor: {
            userId: activeUser.id,
            email: activeUser.email,
            displayName: activeUser.displayName,
            roleCode: activeUser.primaryRole ?? "anonymous",
          },
          request: {
            requestId: requestContext.requestId,
            ipAddress: requestContext.ipAddress,
            userAgent: requestContext.userAgent,
            origin: requestContext.origin,
          },
          action: "auth.login",
          entity: {
            type: "session",
            id: activeUser.id,
            label: activeUser.displayName,
          },
          outcome: "DENIED",
        }),
      );
      await supabase.auth.signOut();
      throw new AccountPendingError(
        "The account is not active and cannot sign in.",
      );
    }

    const now = new Date();
    const updatedUser = await withPrismaTransaction(async (tx) => {
      const user = await this.userRepository.updateLastLoginAt(
        activeUser.id,
        now,
        tx,
      );

      await this.auditService.record(
        createAuditEvent({
          actor: {
            userId: user.id,
            email: user.email,
            displayName: user.display_name,
            roleCode: activeUser.primaryRole ?? "anonymous",
          },
          request: {
            requestId: requestContext.requestId,
            ipAddress: requestContext.ipAddress,
            userAgent: requestContext.userAgent,
            origin: requestContext.origin,
          },
          action: "auth.login",
          entity: {
            type: "session",
            id: user.id,
            label: user.display_name,
          },
          outcome: "SUCCESS",
        }),
        tx,
      );

      return user;
    });

    return {
      ...session,
      user: {
        ...activeUser,
        lastLoginAt: updatedUser.last_login_at?.toISOString() ?? now.toISOString(),
      },
    };
  }

  async signOut(requestContext: RequestContext) {
    const supabase = await createSupabaseServerClient();
    const session = await this.sessionService.resolveSession(requestContext);

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new ServiceUnavailableError("The session could not be terminated.");
    }

    if (session.user) {
      await this.auditService.record(
        createAuditEvent({
          actor: {
            userId: session.user.id,
            email: session.user.email,
            displayName: session.user.displayName,
            roleCode: session.user.primaryRole ?? "anonymous",
          },
          request: {
            requestId: requestContext.requestId,
            ipAddress: requestContext.ipAddress,
            userAgent: requestContext.userAgent,
            origin: requestContext.origin,
          },
          action: "auth.logout",
          entity: {
            type: "session",
            id: session.user.id,
            label: session.user.displayName,
          },
          outcome: "SUCCESS",
        }),
      );
    }

    return session;
  }

  async requestPasswordReset(
    input: PasswordRecoveryInput,
    requestContext: RequestContext,
  ) {
    const parsedInput = passwordRecoverySchema.parse(input);
    const email = sanitizeEmail(parsedInput.email);
    enforceRateLimit(
      createRateLimitKey("auth", "forgot-password", email),
      {
        limit: 3,
        windowMs: 60 * 60 * 1000,
      },
      "Too many password reset requests for this account. Please try again later.",
    );
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteConfig.appUrl}/reset-password`,
    });

    if (error) {
      throw new ServiceUnavailableError(
        "The password reset request could not be processed.",
      );
    }

    const session = await this.sessionService.resolveSession(requestContext);

    await this.auditService.record(
      createAuditEvent({
        actor: {
          userId: session.user?.id ?? null,
          email: session.user?.email ?? email,
          displayName: session.user?.displayName ?? null,
          roleCode: session.user?.primaryRole ?? "anonymous",
        },
        request: {
          requestId: requestContext.requestId,
          ipAddress: requestContext.ipAddress,
          userAgent: requestContext.userAgent,
          origin: requestContext.origin,
        },
        action: "auth.password_reset_requested",
        entity: {
          type: "auth_identity",
          id: email,
          label: email,
        },
        outcome: "SUCCESS",
      }),
    );

    return {
      message:
        "If the account exists, password reset instructions have been sent.",
    };
  }

  async resetPassword(
    input: PasswordResetInput,
    requestContext: RequestContext,
  ) {
    const parsedInput = passwordResetSchema.parse(input);
    const supabase = await createSupabaseServerClient();
    const session = await this.sessionService.resolveSession(requestContext);

    enforceRateLimit(
      createRateLimitKey(
        "auth",
        "reset-password",
        session.user?.supabaseUserId ?? requestContext.ipAddress ?? "unknown",
      ),
      {
        limit: 10,
        windowMs: 15 * 60 * 1000,
      },
      "Too many password reset attempts. Please try again later.",
    );

    if (!session.user) {
      throw new AuthenticationError(
        "A verified reset session is required before updating the password.",
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: parsedInput.password,
    });

    if (error) {
      throw new AuthenticationError(
        "The password reset session is no longer valid.",
      );
    }

    await this.auditService.record(
      createAuditEvent({
        actor: {
          userId: session.user.id,
          email: session.user.email,
          displayName: session.user.displayName,
          roleCode: session.user.primaryRole ?? "anonymous",
        },
        request: {
          requestId: requestContext.requestId,
          ipAddress: requestContext.ipAddress,
          userAgent: requestContext.userAgent,
          origin: requestContext.origin,
        },
        action: "auth.password_reset_completed",
        entity: {
          type: "session",
          id: session.user.id,
          label: session.user.displayName,
        },
        outcome: "SUCCESS",
      }),
    );

    return {
      message: "The password has been updated.",
    };
  }

  async getSession(requestContext: RequestContext) {
    return this.sessionService.resolveSession(requestContext);
  }
}
