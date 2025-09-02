import { NextRequest, NextResponse } from "next/server";

import { AppwriteException, Client, Query, TablesDB, Users } from "node-appwrite";

import { ApiResponse } from "@/core/api/types";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

import { deletePostSchema, updatePostSchema } from "@/schema/post";

import { PostCollaboratorDB, PostDB, PostDetails } from "@/types/post";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { userId, error } = await requireUser(req);
    const loggedInUserId = !!error ? null : userId;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const tables = new TablesDB(client);
    const users = new Users(client);

    let post: PostDB;
    try {
      post = await tables.getRow<PostDB>(db.dbID, db.posts, id);
    } catch (err) {
      if (err instanceof AppwriteException && err.code === 404) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      // rethrow unexpected errors
      throw err;
    }

    if (post.isPrivate) {
      if (!loggedInUserId) {
        // case 1: not logged in
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }

      // case 2: logged in → check collab table for this user
      const collab = await tables.listRows<PostCollaboratorDB>(
        db.dbID,
        db.postCollaborators,
        [
          Query.equal("posts", id),
          Query.equal("userId", loggedInUserId),
          Query.select(["userId", "role"]),
        ]
      );

      if (collab.rows.length === 0) {
        // not a collaborator
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
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

    await Promise.all(collaborators.rows.map(async (collab) => {
      try {
        if (collab.role === "owner")
          ownerName = collab.displayName;
        else if (collab.role === "editor")
          editorNames.push(collab.displayName);
      } catch {
        if (collab.role === "owner")
          ownerName = "Unknown User";
        else if (collab.role === "editor")
          editorNames.push("Unknown User");
      }
    }));

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
    };

    return NextResponse.json<ApiResponse<PostDetails>>({
      success: true,
      data: payload,
    });
  } catch (err) {
    console.error("Error fetching post details: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch post details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const parsed = updatePostSchema.safeParse({ ...body, postId: id });

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
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
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden: You don't have access" },
        { status: 403 }
      );
    }

    await tables.updateRow(db.dbID, db.posts, postId, updateData);

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