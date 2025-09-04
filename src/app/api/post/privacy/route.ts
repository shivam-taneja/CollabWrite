import { NextRequest } from "next/server";

import { Query, TablesDB } from "node-appwrite";

import { jsonError, jsonOk, serverError } from "@/lib/api-responses";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

import { updatePostPrivacySchema } from "@/schema/post";

import { PostDB } from "@/types/post";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updatePostPrivacySchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.message)
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
      return jsonError("Forbidden: You don't have access", 403)
    }

    const postDoc = await tables.getRow<PostDB>(db.dbID, db.posts, postId);

    if (postDoc.isPrivate === privacySetting) {
      return jsonError(privacySetting ? "Post is already private" : "Post is  public")
    }

    await tables.updateRow(db.dbID, db.posts, postId, {
      isPrivate: privacySetting,
    });

    return jsonOk({ updateData: true })
  } catch (err) {
    console.error("Error updating post privacy: ", err);
    return serverError("Failed to update post privacy settings")
  }
}
