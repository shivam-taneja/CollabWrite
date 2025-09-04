import { NextRequest } from "next/server";

import { ID, Query, TablesDB } from "node-appwrite";

import { jsonError, jsonOk, serverError } from "@/lib/api-responses";
import { users } from "@/lib/appwrite-server";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

import { addPostCollaboratorSchema, postIdSchema, removePostCollaboratorSchema } from "@/schema/post";

import { PostCollaboratorDB, PostCollaboratorsEditorDetails } from "@/types/post";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = postIdSchema.safeParse({ postId: searchParamsPostId });
    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const { postId } = parsed.data;

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const ownerCheck = await tables.listRows(db.dbID, db.postCollaborators, [
      Query.equal("userId", userId),
      Query.equal("posts", postId),
      Query.equal("role", "owner"),
    ]);

    if (ownerCheck.total === 0) {
      return jsonError("Forbidden: You don't have access", 403)
    }

    const editors = await tables.listRows<PostCollaboratorDB>(db.dbID, db.postCollaborators, [
      Query.equal("posts", postId),
      Query.equal("role", "editor"),
    ]);

    const editorDetails: PostCollaboratorsEditorDetails[] = await Promise.all(
      editors.rows.map(async (c: any) => {
        try {
          const user = await users.get(c.userId);

          return {
            $id: user.$id,
            displayName: user.name,
            email: user.email,
            role: c.role,
          };
        } catch (err) {
          return {
            $id: c.userId,
            displayName: 'Unkown User',
            email: "Unkown User",
            role: c.role,
          };
        }
      })
    );

    return jsonOk(editorDetails)
  } catch (err) {
    console.error("Error fetching editor details: ", err);
    return serverError("Failed to fetch editors")
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = addPostCollaboratorSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const { postId, email } = parsed.data;

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

    let targetUser;
    try {
      const foundUsers = await users.list([
        Query.equal("email", email),
      ]);

      if (foundUsers.total === 0) {
        return jsonOk({ added: true })
      }

      targetUser = foundUsers.users[0];
    } catch {
      return jsonOk({ added: false })
    }

    if (targetUser.$id === userId) {
      return jsonError("Forbidden: You cannot add yourself as a collaborator", 403)
    }

    await tables.createRow(
      db.dbID,
      db.postCollaborators,
      ID.unique(),
      {
        userId: targetUser.$id,
        displayName: targetUser.name ?? targetUser.email.charAt(0),
        role: "editor",
        posts: postId,
      }
    );

    return jsonOk({ added: true })
  } catch (err) {
    console.error("Error adding collaborator: ", err);
    return serverError("Failed to add collaborator")
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");
    const searchParamsCollaboratorId = searchParams.get("collaboratorId");

    const parsed = removePostCollaboratorSchema.safeParse({ postId: searchParamsPostId, collaboratorId: searchParamsCollaboratorId });
    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const { collaboratorId, postId } = parsed.data

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

    if (collaboratorId === userId) {
      return jsonError("Forbidden: Owner cannot be removed from the post", 403)
    }

    const collaboratorDocs = await tables.listRows(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("userId", collaboratorId),
        Query.equal("posts", postId),
        Query.equal("role", "editor"),
      ]
    );

    if (collaboratorDocs.total === 0) {
      return jsonError("User is not a collaborator on this post")
    }

    const collaboratorDoc = collaboratorDocs.rows[0];

    await tables.deleteRow(
      db.dbID,
      db.postCollaborators,
      collaboratorDoc.$id
    );

    return jsonOk({ removed: true })
  } catch (err) {
    console.error("Error removing collaborator: ", err);
    return serverError("Failed to remove collaborator")
  }
}