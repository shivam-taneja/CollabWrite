import { NextRequest, NextResponse } from "next/server";

import { Account, Client, Query, TablesDB } from "node-appwrite";

import { ApiResponse } from "@/core/api/types";
import db from "@/lib/db";
import { updatePostSchema } from "@/schema/post";

import { UserPost } from "@/types/user";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { postId, title, summary } = parsed.data;

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jwt = authHeader.split(" ")[1];
    const userClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setJWT(jwt);

    let userId: string;
    try {
      const account = new Account(userClient);
      const { $id } = await account.get();
      userId = $id;
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const tables = new TablesDB(userClient);

    const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
      Query.equal("userId", userId),
      Query.equal("posts", postId),
      Query.equal("role", ["owner", "editor"]),
    ]);

    if (collabs.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden: You don't have access" },
        { status: 403 }
      );
    }

    const updated = await tables.updateRow<UserPost>(
      db.dbID,
      db.posts,
      postId,
      {
        title,
        summary,
      }
    );

    return NextResponse.json<ApiResponse<Pick<UserPost, "$id">>>({
      success: true,
      data: {
        $id: updated.$id,
      },
    });
  } catch (err) {
    console.error("Error updating post: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}
