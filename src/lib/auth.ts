import { NextRequest } from "next/server";

import { Account, Client } from "node-appwrite";

import { jsonError } from "./api-responses";

export async function requireUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return { error: jsonError("Unauthorized: No token found", 401) };
  }

  const jwt = authHeader.split(" ")[1];
  const userClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setJWT(jwt);

  try {
    const account = new Account(userClient);
    const userDetails = await account.get();
    return { userId: userDetails.$id, userDetails, userClient };
  } catch {
    return { error: jsonError("Unauthorized: Invalid or expired token", 401) };
  }
}
