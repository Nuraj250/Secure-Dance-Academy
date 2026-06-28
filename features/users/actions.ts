"use server";

import { createRequestContext } from "@/lib/http/request-context";
import type { UserUpdateInput } from "@/features/users/schemas/user.schema";
import { AuthenticationError } from "@/lib/http/errors";
import { SessionService } from "@/features/authentication/services/session.service";
import { UserService } from "@/features/users/services/user.service";

const sessionService = new SessionService();
const userService = new UserService();

export async function updateCurrentUserAction(input: UserUpdateInput) {
  const requestContext = createRequestContext();
  const session = await sessionService.resolveSession(requestContext);

  if (!session.user) {
    throw new AuthenticationError();
  }

  return userService.updateUser(session, session.user.id, input, requestContext);
}

export async function updateUserAction(params: {
  userId: string;
  input: UserUpdateInput;
}) {
  const requestContext = createRequestContext();
  const session = await sessionService.resolveSession(requestContext);

  if (!session.user) {
    throw new AuthenticationError();
  }

  return userService.updateUser(session, params.userId, params.input, requestContext);
}

export async function archiveUserAction(input: {
  userId: string;
}) {
  const requestContext = createRequestContext();
  const session = await sessionService.resolveSession(requestContext);

  if (!session.user) {
    throw new AuthenticationError();
  }

  return userService.archiveUser(session, input.userId, requestContext);
}
