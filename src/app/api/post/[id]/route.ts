import { NextRequest } from "next/server";

import { AppwriteException, Query, TablesDB } from "node-appwrite";

import { jsonError, jsonOk, notFound, serverError } from "@/lib/api-responses";
import { tables } from "@/lib/appwrite-server";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

import { deletePostSchema, updatePostSchema } from "@/schema/post";

import { PostCollaboratorDB, PostCollaboratorsRole, PostDB, PostDetails } from "@/types/post";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { userId, error } = await requireUser(req);
    const loggedInUserId = !!error ? null : userId;

    let post: PostDB;
    try {
      post = await tables.getRow<PostDB>(db.dbID, db.posts, id);
    } catch (err) {
      if (err instanceof AppwriteException && err.code === 404) {
        return notFound("Post not found")
      }
      // rethrow unexpected errors
      throw err;
    }

    let viewerRole: PostCollaboratorsRole = 'viewer';
    let collaboratorRowId: string | null = null;

    if (loggedInUserId) {
      const collab = await tables.listRows<PostCollaboratorDB>(
        db.dbID,
        db.postCollaborators,
        [
          Query.equal("posts", id),
          Query.equal("userId", loggedInUserId),
          Query.select(["role"]),
          Query.limit(1),
        ]
      );

      if (collab.rows.length > 0) {
        // user is owner or editor
        viewerRole = collab.rows[0].role;
        collaboratorRowId = collab.rows[0].$id;
      } else if (post.isPrivate) {
        // logged in but not collaborator -> block
        return notFound("Post not found")
      }
    } else if (post.isPrivate) {
      // not logged in + private post
      return notFound("Post not found")
    }

    const collaborators = await tables.listRows<PostCollaboratorDB>(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("posts", id),
        Query.select(["userId", "role", "displayName"]),
      ]
    );


    let ownerName = "Unknown User";
    const editorNames: string[] = [];

    for (const c of collaborators.rows) {
      const name = c.displayName ?? "Unknown User";
      if (c.role === "owner")
        ownerName = name;
      else if (c.role === "editor")
        editorNames.push(name);
    }

    const payload: PostDetails = {
      $id: post.$id,
      title: post.title,
      content: post.content,
      summary: post.summary,
      category: post.category,
      $createdAt: post.$createdAt,
      $updatedAt: post.$updatedAt,
      postCollaborators: {
        owner: ownerName,
        collaborators: editorNames,
      },
      permissions: {
        collaboratorRowId,
        role: viewerRole,
        canEdit: viewerRole !== "viewer",
        canUpdate: viewerRole === "owner",
      },
    };

    return jsonOk(payload);
  } catch (err) {
    console.error("Error fetching post details: ", err);
    return serverError("Failed to fetch post details")
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const parsed = updatePostSchema.safeParse({ ...body, postId: id });

    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const { postId, ...updateData } = parsed.data;

    const collabs = await tables.listRows<PostCollaboratorDB>(db.dbID, db.postCollaborators, [
      Query.equal("posts", postId),
      Query.equal("userId", userId),
      Query.equal("role", ["owner", "editor"]),
    ]);

    if (collabs.total === 0) {
      return jsonError("Forbidden: You don't have access", 403)
    }

    await tables.updateRow(db.dbID, db.posts, postId, updateData);

    return jsonOk({ updateData: true })
  } catch (err) {
    console.error("Error updating post: ", err);
    return serverError("Failed to update post")
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = deletePostSchema.safeParse({ postId: searchParamsPostId });
    if (!parsed.success) {
      return jsonError(parsed.error.message)
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
      return jsonError("Forbidden: You don't have access", 403)
    }

    await tables.deleteRow(db.dbID, db.posts, postId);

    return jsonOk({ deleted: true })
  } catch (err) {
    console.error("Error deleting post: ", err);
    return serverError("Failed to update post")
  }
}