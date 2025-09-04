import { NextRequest } from "next/server";

import { Query, TablesDB } from "node-appwrite";

import { jsonError, jsonOk, serverError } from "@/lib/api-responses";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

import { postIdSchema } from "@/schema/post";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = postIdSchema.safeParse({ postId: searchParamsPostId });
    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const { postId } = parsed.data

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

    const editorDocs = await tables.listRows(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("posts", postId),
        Query.equal("role", "editor"),
      ]
    );

    await Promise.all(
      editorDocs.rows.map(editor => tables.deleteRow(db.dbID, db.postCollaborators, editor.$id))
    )

    return jsonOk({ stoppedSharing: true })
  } catch (err) {
    console.error("Error stopping post sharing: ", err);
    return serverError("Failed to stop post sharing")
  }
}
