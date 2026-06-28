"use server";

import { createRequestContext } from "@/lib/http/request-context";
import type { PasswordRecoveryInput, PasswordResetInput, SignInInput } from "@/features/authentication/schemas/auth.schema";
import { AuthenticationService } from "@/features/authentication/services/auth.service";

const authenticationService = new AuthenticationService();

export async function signInAction(input: SignInInput) {
  const requestContext = createRequestContext();
  return authenticationService.signIn(input, requestContext);
}

export async function signOutAction() {
  const requestContext = createRequestContext();
  await authenticationService.signOut(requestContext);
}

export async function requestPasswordResetAction(input: PasswordRecoveryInput) {
  const requestContext = createRequestContext();
  return authenticationService.requestPasswordReset(input, requestContext);
}

export async function resetPasswordAction(input: PasswordResetInput) {
  const requestContext = createRequestContext();
  return authenticationService.resetPassword(input, requestContext);
}

export async function getSessionAction() {
  const requestContext = createRequestContext();
  return authenticationService.getSession(requestContext);
}
