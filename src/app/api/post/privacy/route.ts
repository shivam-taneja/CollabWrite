import { NextRequest, NextResponse } from "next/server";

import { Query, TablesDB } from "node-appwrite";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { updatePostPrivacySchema } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { PostDB } from "@/types/post";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updatePostPrivacySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { postId, privacySetting } = parsed.data;

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const ownerCheck = await tables.listRows(
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

    const postDoc = await tables.getRow<PostDB>(db.dbID, db.posts, postId);

    if (postDoc.isPrivate === privacySetting) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: privacySetting
            ? "Post is already private"
            : "Post is already public",
        },
        { status: 400 }
      );
    }

    await tables.updateRow(db.dbID, db.posts, postId, {
      isPrivate: privacySetting,
    });

    return NextResponse.json<ApiResponse<{ updated: true }>>({
      success: true,
      data: { updated: true },
    });
  } catch (err) {
    console.error("Error updating post privacy: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update post privacy" },
      { status: 500 }
    );
  }
}
