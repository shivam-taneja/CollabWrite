import { NextRequest, NextResponse } from "next/server";

import { Databases, Query } from "node-appwrite";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { postIdSchema } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = postIdSchema.safeParse({ postId: searchParamsPostId });
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { postId } = parsed.data

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const databases = new Databases(userClient);

    const ownerCheck = await databases.listDocuments(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("userId", userId),
        Query.equal("posts", postId),
        Query.equal("role", "owner"),
      ]
    );

    if (ownerCheck.total === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const editorDocs = await databases.listDocuments(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("posts", postId),
        Query.equal("role", "editor"),
      ]
    );

    for (const editor of editorDocs.documents) {
      await databases.deleteDocument(db.dbID, db.postCollaborators, editor.$id);
    }

    return NextResponse.json<ApiResponse<{ stoppedSharing: true }>>({
      success: true,
      data: { stoppedSharing: true },
    });
  } catch (err) {
    console.error("Error stopping post sharing: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to stop post sharing" },
      { status: 500 }
    );
  }
}
