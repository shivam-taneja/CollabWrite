import { NextResponse } from "next/server";

import { ApiResponse } from "@/core/api/types";

export const jsonOk = <T>(data: T) => NextResponse.json<ApiResponse<T>>({ success: true, data });

export const jsonError = (error: string, status = 400) => NextResponse.json<ApiResponse>({ success: false, error }, { status });

export const notFound = (msg = "Not found") => jsonError(msg, 404);

export const serverError = (msg = "Internal Server Error") => jsonError(msg, 500);
