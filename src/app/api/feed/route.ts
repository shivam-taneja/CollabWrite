
import { NextResponse } from "next/server";
import { Client, Query, TablesDB, Users } from "node-appwrite";

import { ApiResponse } from "@/core/api/types";
import db from "@/lib/db";

import { FeedData } from "@/types/feed";

import { FEED_LIMIT } from "@/utils/constants";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const offset = Number(searchParams.get("offset")) || 0;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const tables = new TablesDB(client);
    const users = new Users(client);

    const queries: any[] = [
      Query.equal("isPrivate", false),
      Query.select(["*", "postCollaborators.*"]),
      Query.limit(FEED_LIMIT),
      Query.offset(offset),
    ];

    if (category) {
      queries.push(Query.equal("category", category));
    }

    if (search) {
      queries.push(Query.search("title", search));
      queries.push(Query.search("summary", search));
    }

    const posts = await tables.listRows(db.dbID, db.posts, queries);

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
          enrichedCollabs.push(collab); // fallback
        }
      }

      enrichedPosts.push({
        ...post,
        postCollaborators: enrichedCollabs,
      });
    }

    const total = enrichedPosts.length;
    const page = Math.floor(offset / FEED_LIMIT) + 1;
    const totalPages = Math.ceil(total / FEED_LIMIT);

    const payload: FeedData = {
      rows: enrichedPosts,
      total,
      page,
      totalPages,
    };

    return NextResponse.json<ApiResponse<FeedData>>({
      success: true,
      data: payload,
    });
  } catch (err) {
    console.error("Error fetching public feed:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
