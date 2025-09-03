import { NextRequest, NextResponse } from "next/server";

import { ID, Permission, Role, TablesDB } from "node-appwrite";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { createPostSchema } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { CreatePostResult } from "@/types/post";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid body: ${parsed.error.message}` },
        { status: 400 }
      );
    }

    const { title } = parsed.data;

    const { userId, userDetails, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    const post = await tables.createRow(
      db.dbID,
      db.posts,
      ID.unique(),
      {
        title,
        content: "",
        summary: "This is default summary",
        category: "Other",
        isPrivate: true,
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    try {
      await tables.createRow(
        db.dbID,
        db.postCollaborators,
        ID.unique(),
        {
          userId,
          role: "owner",
          posts: post.$id,
          displayName: userDetails.name ?? userDetails.email.charAt(0)
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );

      return NextResponse.json<ApiResponse<CreatePostResult>>({
        success: true,
        data: { $id: post.$id },
      });
    } catch (err) {
      // Rollback if collaborator creation fails
      await tables.deleteRow(db.dbID, db.posts, post.$id);

      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to create collaborator" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error creating post: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}