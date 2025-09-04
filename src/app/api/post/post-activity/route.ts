import { NextRequest, NextResponse } from "next/server";

import { ID, Query, TablesDB } from "node-appwrite";

import { jsonError, jsonOk, serverError } from "@/lib/api-responses";
import { requireUser } from "@/lib/auth";

import db from "@/lib/db";
import { postIdSchema } from "@/schema/post";
import { PostUserActivity } from "@/types/post";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = postIdSchema.safeParse({ postId: searchParamsPostId });
    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const { postId } = parsed.data;

    const { userId, userClient, error, userDetails } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
      Query.equal("posts", postId),
      Query.equal("userId", userId),
      Query.equal("role", ["owner", "editor"]),
    ]);

    if (collabs.total === 0) {
      return jsonError("Forbidden: You don't have access", 403)
    }

    const existingActivity = await tables.listRows(db.dbID, db.postActivity, [
      Query.equal("posts", postId)
    ])

    let doc;
    if (existingActivity.total === 0) {
      doc = await tables.createRow(
        db.dbID,
        db.postActivity,
        ID.unique(),
        {
          posts: postId,
          presence: JSON.stringify([
            { userId, displayName: userDetails.name, lastActive: new Date().toISOString() }
          ])
        }
      )
    } else {
      doc = existingActivity.rows[0];
      const presence: PostUserActivity[] = JSON.parse(doc.presence);

      const updatedPresence = [
        ...presence.filter((u) => u.userId !== userId),
        { userId, displayName: userDetails.name, lastActive: new Date().toISOString() },
      ];

      doc = await tables.updateRow(db.dbID, db.postActivity, doc.$id, {
        presence: JSON.stringify(updatedPresence),
      });
    }

    return jsonOk({ $id: doc.$id, presence: doc.presence })
  } catch (err) {
    console.error("Error while fetching post activity: ", err);

    return serverError("Failed to fetch post activity")
  }
}