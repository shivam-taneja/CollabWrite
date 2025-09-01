import { NextRequest, NextResponse } from "next/server";

import { Account, Client } from "node-appwrite";

import { ApiResponse } from "@/core/api/types";

export async function requireUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return { error: NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 }) };
  }

  const jwt = authHeader.split(" ")[1];
  const userClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setJWT(jwt);

  try {
    const account = new Account(userClient);
    const { $id } = await account.get();
    return { userId: $id, userClient };
  } catch {
    return { error: NextResponse.json<ApiResponse>({ success: false, error: "Invalid or expired token" }, { status: 401 }) };
  }
}
