import { NextResponse } from "next/server";

import { ApiResponse } from "@/core/api/types";
import { getAccount } from "@/lib/appwrite";
import { LoginFormData, loginSchema } from "@/schema/auth";

type LoginResponse = ApiResponse<{ requiresVerification?: boolean }>;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data as LoginFormData;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const account = getAccount();

    // Create session
    // await account.createEmailPasswordSession(email, password);

    // Issue JWT for cookie-based auth
    const jwt = await account.createJWT();
    console.log(jwt)
    const res = NextResponse.json<LoginResponse>({
      success: true,
      data: { requiresVerification: true }, // TODO: check from appwrite
    });

    // res.cookies.set("session", jwt.jwt, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    // });

    return res;
  } catch (error: any) {
    console.error("[LOGIN_ERROR]: ", error);

    const message =
      error?.response?.message || error?.message || "Login failed";

    return NextResponse.json<LoginResponse>(
      { success: false, error: message, },
      { status: 401 }
    );
  }
}
