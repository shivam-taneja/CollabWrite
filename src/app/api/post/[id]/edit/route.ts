import { ApiResponse } from "@/core/api/types";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { UpdatePostDetails } from "@/types/post";
import { UserPost } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import { Query, TablesDB } from "node-appwrite";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const body: Partial<UpdatePostDetails> = await req.json();

    if (!id || !body || Object.keys(body).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
      Query.equal("userId", userId),
      Query.equal("posts", id),
      Query.equal("role", ["owner", "editor"]),
    ]);

    if (collabs.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden: You don't have access" },
        { status: 403 }
      );
    }

    await tables.updateRow<UserPost>(
      db.dbID,
      db.posts,
      id,
      body
    );

    return NextResponse.json<ApiResponse<{ updated: true }>>({
      success: true,
      data: { updated: true },
    });
  } catch (err) {
    console.error("Error updating post: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}