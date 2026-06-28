import { NextResponse } from "next/server";
import type {
  ApiError,
  ApiSuccess,
  PaginatedResponse,
} from "@/types/api";

function applyNoStoreHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export function successResponse<TData>(
  message: string,
  data: TData,
  metadata?: Record<string, unknown>,
  status = 200,
) {
  const body: ApiSuccess<TData> = {
    status: "success",
    message,
    data,
    metadata,
  };

  return applyNoStoreHeaders(NextResponse.json(body, { status }));
}

export function paginatedSuccessResponse<TItem>(
  message: string,
  data: PaginatedResponse<TItem>,
  metadata?: Record<string, unknown>,
) {
  return successResponse(message, data, metadata);
}

export function errorResponse(
  errorCode: string,
  message: string,
  status = 400,
  validationDetails?: Record<string, unknown>,
) {
  const body: ApiError = {
    status: "error",
    errorCode,
    message,
    validationDetails,
  };

  return applyNoStoreHeaders(NextResponse.json(body, { status }));
}
