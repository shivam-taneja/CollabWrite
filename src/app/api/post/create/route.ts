import { NextResponse } from "next/server";

import { Account, Client, Databases, ID, Permission, Role } from "node-appwrite";

import db from "@/lib/db";
import { createPostSchema } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { CreatePostResult } from "@/types/post";

export async function POST(req: Request) {
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

    // Step 1: Validate JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jwt = authHeader.split(" ")[1];
    const userClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setJWT(jwt);

    let userId: string;
    try {
      const account = new Account(userClient);
      const user = await account.get();
      userId = user.$id;
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const databases = new Databases(userClient);

    // Step 2: Create post
    const post = await databases.createDocument(
      db.dbID,
      db.posts,
      ID.unique(),
      {
        title,
        content: "",
        summary: "",
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
      // Step 3: Add collaborator entry
      await databases.createDocument(
        db.dbID,
        db.postCollaborators,
        ID.unique(),
        {
          userId,
          role: "owner",
          posts: post.$id,
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
      await databases.deleteDocument(db.dbID, db.posts, post.$id);

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
