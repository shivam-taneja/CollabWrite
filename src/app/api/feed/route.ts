import { NextResponse } from "next/server";

import { Client, Query, TablesDB, Users } from "node-appwrite";

import db from "@/lib/db";
import { backendFeedSearchSchema } from "@/schema/feed";

import { ApiResponse } from "@/core/api/types";
import { FeedData } from "@/types/feed";
import { PostWithCollab } from "@/types/post";

import { FEED_LIMIT } from "@/utils/constants";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsedDefaults = backendFeedSearchSchema.safeParse({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      offset: Number(searchParams.get('offset')),
    });

    if (!parsedDefaults.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid Search Params: ${parsedDefaults.error.message}` },
        { status: 400 }
      );
    }

    const search = parsedDefaults.data.search;
    const category = parsedDefaults.data.category;
    const offset = parsedDefaults.data.offset;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const tables = new TablesDB(client);
    const users = new Users(client);

    const queries = [
      Query.equal("isPrivate", false),
      Query.select(["$id", "title", "summary", "category", "$createdAt", "postCollaborators.*"]),
      Query.limit(FEED_LIMIT),
      Query.offset(offset),
    ];

    if (category) {
      queries.push(Query.equal("category", category));
    }

    if (search) {
      queries.push(Query.or([
        Query.search("title", search),
        Query.search("summary", search),
      ]));
    }

    const posts = await tables.listRows<PostWithCollab>(db.dbID, db.posts, queries);

    const enrichedPosts: FeedData['rows'] = [];
    for (const post of posts.rows) {
      const collaborators = post.postCollaborators ?? [];
      const owner = collaborators.find(c => c.role === "owner");

      let ownerName = "Unknown User";

      if (owner) {
        try {
          const user = await users.get(owner.userId);
          ownerName = user.name;
        } catch {
          ownerName = "Unknown User";
        }
      }

      enrichedPosts.push({
        $id: post.$id,
        title: post.title,
        summary: post.summary,
        $createdAt: post.$createdAt,
        category: post.category,
        postCollaborators: {
          count: collaborators.length,
          owner: ownerName
        },
      });
    }

    const total = posts.total;
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
