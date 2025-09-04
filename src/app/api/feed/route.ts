import { Query } from "node-appwrite";

import { jsonError, jsonOk, serverError } from "@/lib/api-responses";
import db from "@/lib/db";

import { backendFeedSearchSchema } from "@/schema/feed";

import { FeedData } from "@/types/feed";
import { PostCollaboratorDB, PostDB } from "@/types/post";

import { tables } from "@/lib/appwrite-server";
import { FEED_LIMIT } from "@/utils/constants";

type PostResultDB = PostDB & {
  postCollaborators: PostCollaboratorDB[]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const homepageHeader = req.headers.get("x-homepage-request");

    const parsed = backendFeedSearchSchema.safeParse({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      offset: Number(searchParams.get('offset')),
    });

    if (!parsed.success) {
      return jsonError(parsed.error.message)
    }

    const search = parsed.data.search;
    const category = parsed.data.category;
    const offset = parsed.data.offset;

    const limit = homepageHeader === "true" ? 3 : FEED_LIMIT;

    const queries = [
      Query.equal("isPrivate", false),
      Query.select(["$id", "title", "summary", "category", "$createdAt", "postCollaborators.*"]),
      Query.limit(limit),
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

    const posts = await tables.listRows<PostResultDB>(db.dbID, db.posts, queries);

    const enrichedPosts: FeedData['rows'] = [];
    for (const post of posts.rows) {
      const collaborators = post.postCollaborators;

      const owner = collaborators.find(c => c.role === "owner");

      enrichedPosts.push({
        $id: post.$id,
        title: post.title,
        summary: post.summary,
        $createdAt: post.$createdAt,
        category: post.category,
        postCollaborators: {
          count: collaborators.length,
          owner: owner?.displayName ?? "Unkown User"
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

    return jsonOk(payload)
  } catch (err) {
    console.error("Error fetching public feed: ", err);
    return serverError("Failed to fetch feed")
  }
}
