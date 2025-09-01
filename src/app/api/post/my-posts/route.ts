import { NextRequest, NextResponse } from "next/server";
import { Query, TablesDB } from "node-appwrite";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

import { ApiResponse } from "@/core/api/types";
import { UserPost, UserPostsSection } from "@/types/user";

export async function GET(req: NextRequest) {
  try {
    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const tables = new TablesDB(userClient);

    async function fetchPostsByRole(role: "owner" | "editor"): Promise<UserPostsSection> {
      const collabs = await tables.listRows(db.dbID, db.postCollaborators, [
        Query.equal("userId", userId!),
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
