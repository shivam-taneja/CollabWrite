import { NextResponse } from "next/server";
import { Account, Client, Query, TablesDB, Users } from "node-appwrite";

import { ApiResponse } from "@/core/api/types";
import db from "@/lib/db";
import { userPostsSchema } from "@/schema/user";

import { FEED_LIMIT } from "@/utils/constants";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsedDefaults = userPostsSchema.safeParse({
      page: searchParams.get("page") || undefined,
    });

    if (!parsedDefaults.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid Search Params: ${parsedDefaults.error.message}` },
        { status: 400 }
      );
    }

    const page = parsedDefaults.data.page || 1;
    const offset = (page - 1) * FEED_LIMIT;

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

    try {
      const account = new Account(userClient);
      await account.get();
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const tables = new TablesDB(userClient);

    // Step 1: get post_collaborators for this user
    const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
      Query.equal("role", ["owner", "editor"]),
      Query.select(["posts.$id"]),
    ]);

    const postIds = collabs.rows.map((c: any) => c.posts.$id);
    if (postIds.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { documents: [], total: 0 },
      });
    }

    // Step 2: fetch posts with pagination + collaborators
    const posts = await tables.listRows(db.dbID, db.posts, [
      Query.equal("$id", postIds),
      Query.select(["*", "postCollaborators.*"]),
      Query.limit(FEED_LIMIT),
      Query.offset(offset),
    ]);

    // Step 3: use server client for Users API
    const serverClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const users = new Users(serverClient);

    const enrichedPosts = [];
    for (const post of posts.rows) {
      const enrichedCollabs = [];
      for (const collab of post.postCollaborators ?? []) {
        try {
          const user = await users.get(collab.userId);
          enrichedCollabs.push({
            ...collab,
            name: user.name,
            email: user.email,
          });
        } catch {
          enrichedCollabs.push(collab);
        }
      }

      enrichedPosts.push({
        ...post,
        postCollaborators: enrichedCollabs,
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { ...posts, rows: enrichedPosts },
    });
  } catch (err) {
    console.error("Error fetching user posts: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}
