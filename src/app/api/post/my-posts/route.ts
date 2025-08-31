import { NextResponse } from "next/server";
import { Account, Client, Query, TablesDB } from "node-appwrite";

import db from "@/lib/db";

// import { FEED_LIMIT } from "@/utils/constants";

import { ApiResponse } from "@/core/api/types";
import { UserPost, UserPostsSection } from "@/types/user";

export async function GET(req: Request) {
  try {
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
      const { $id } = await account.get();
      userId = $id;
    } catch {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const tables = new TablesDB(userClient);

    async function fetchPostsByRole(role: "owner" | "editor"): Promise<UserPostsSection> {
      const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
        Query.equal("userId", userId),
        Query.equal("role", role),
        Query.select(["posts.$id"]),
      ]);

      const postIds = collabs.rows.map((c: any) => c.posts.$id);
      if (postIds.length === 0) {
        return {
          posts: [],
          total: 0,
        };
      }

      const total = postIds.length;

      const posts = await tables.listRows<UserPost>(db.dbID, db.posts, [
        Query.equal("$id", postIds),
        Query.select(["$id", "title", "summary", "category", "$createdAt", "isPrivate"]),
      ]);

      return {
        posts: posts.rows.map((p) => ({
          $id: p.$id,
          $createdAt: p.$createdAt,
          title: p.title,
          summary: p.summary,
          category: p.category,
          isPrivate: p.isPrivate,
        })),
        total,
      };
    }

    const [owner, editor] = await Promise.all([
      fetchPostsByRole("owner"),
      fetchPostsByRole("editor"),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        owner,
        editor,
        totalPosts: owner.total + editor.total
      },
    });
  } catch (err) {
    console.error("Error fetching user posts: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}
