import { ApiResponse } from "@/core/api/types";
import db from "@/lib/db";
import { PostCollaboratorDB, PostDB, PostDetails } from "@/types/post";
import { NextRequest, NextResponse } from "next/server";
import { AppwriteException, Client, Models, Query, TablesDB, Users } from "node-appwrite";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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

    if (!post || post.isPrivate) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const collaborators = await tables.listRows<PostCollaboratorDB>(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("posts", id),
        Query.select(["userId", "role"]),
      ]
    );

    let ownerName = "Unknown User";
    const editorNames: string[] = [];

    for (const collab of collaborators.rows) {
      try {
        const user = await users.get(collab.userId);

        if (collab.role === "owner") {
          ownerName = user.name;
        } else if (collab.role === "editor") {
          editorNames.push(user.name);
        }
      } catch {
        if (collab.role === "owner") {
          ownerName = "Unknown User";
        } else if (collab.role === "editor") {
          editorNames.push("Unknown User");
        }
      }
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
