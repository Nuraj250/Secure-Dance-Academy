import { NextResponse } from "next/server";

type SuccessBody<TData> = {
  status: "success";
  message: string;
  data: TData;
  metadata?: Record<string, unknown>;
};

type ErrorBody = {
  status: "error";
  errorCode: string;
  message: string;
  validationDetails?: Record<string, unknown>;
};

export function successResponse<TData>(
  message: string,
  data: TData,
  metadata?: Record<string, unknown>,
) {
  const body: SuccessBody<TData> = { status: "success", message, data, metadata };
  return NextResponse.json(body);
}

export function errorResponse(
  errorCode: string,
  message: string,
  status = 400,
  validationDetails?: Record<string, unknown>,
) {
  const body: ErrorBody = {
    status: "error",
    errorCode,
    message,
    validationDetails,
  };
  return NextResponse.json(body, { status });
}
