import { NextRequest, NextResponse } from "next/server";

import { Query, TablesDB } from "node-appwrite";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { deletePostSchema, updatePostSchema } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
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

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

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


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = deletePostSchema.safeParse({ postId: searchParamsPostId });
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { postId } = parsed.data;

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
      Query.equal("userId", userId),
      Query.equal("posts", postId),
      Query.equal("role", ["owner"]),
    ]);

    if (collabs.rows.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden: You don't have access" },
        { status: 403 }
      );
    }

    await tables.deleteRow(db.dbID, db.posts, postId);

    return NextResponse.json<ApiResponse<{ deleted: true }>>({
      success: true,
      data: { deleted: true },
    });
  } catch (err) {
    console.error("Error deleting post: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}