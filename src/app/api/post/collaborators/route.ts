import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID, Query, Users } from "node-appwrite";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { addPostCollaboratorSchema, postIdSchema, removePostCollaboratorSchema } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { CollaboratorsDetails } from "@/types/post";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");

    const parsed = postIdSchema.safeParse({ postId: searchParamsPostId });
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

    const dbClient = new Databases(userClient);

    const ownerCheck = await dbClient.listDocuments(db.dbID, db.postCollaborators, [
      Query.equal("userId", userId),
      Query.equal("posts", postId),
      Query.equal("role", "owner"),
    ]);

    if (ownerCheck.documents.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const editors = await dbClient.listDocuments(db.dbID, db.postCollaborators, [
      Query.equal("posts", postId),
      Query.equal("role", "editor"),
    ]);

    const serverClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const users = new Users(serverClient);

    const editorDetails: CollaboratorsDetails[] = await Promise.all(
      editors.documents.map(async (c: any) => {
        try {
          const user = await users.get(c.userId);

          return {
            $id: user.$id,
            name: user.name,
            email: user.email,
            role: c.role,
          };
        } catch (err) {
          return {
            $id: c.userId,
            name: 'Unkown User',
            email: "Unkown User",
            role: c.role,
          };
        }
      })
    );

    return NextResponse.json<ApiResponse<CollaboratorsDetails[]>>({
      success: true,
      data: editorDetails,
    });
  } catch (err) {
    console.error("Error fetching editor details: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch editors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = addPostCollaboratorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { postId, email } = parsed.data;

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const databases = new Databases(userClient);

    const ownerCheck = await databases.listDocuments(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("userId", userId),
        Query.equal("posts", postId),
        Query.equal("role", "owner"),
      ]
    );

    if (ownerCheck.documents.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const serverClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const users = new Users(serverClient);

    let targetUser;
    try {
      const foundUsers = await users.list([
        Query.equal("email", email),
      ]);

      if (foundUsers.total === 0) {
        return NextResponse.json<ApiResponse<{ added: boolean }>>({
          success: true,
          data: { added: false },
        });
      }

      targetUser = foundUsers.users[0];
    } catch {
      return NextResponse.json<ApiResponse<{ added: boolean }>>({
        success: true,
        data: { added: false },
      });
    }

    if (targetUser.$id === userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "You cannot add yourself as a collaborator" },
        { status: 400 }
      );
    }

    await databases.createDocument(
      db.dbID,
      db.postCollaborators,
      ID.unique(),
      {
        userId: targetUser.$id,
        role: "editor",
        posts: postId,
      }
    );

    return NextResponse.json<ApiResponse<{ added: boolean }>>({
      success: true,
      data: { added: true },
    });
  } catch (err) {
    console.error("Error adding collaborator: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to add collaborator" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchParamsPostId = searchParams.get("postId");
    const searchParamsCollaboratorId = searchParams.get("collaboratorId");

    const parsed = removePostCollaboratorSchema.safeParse({ postId: searchParamsPostId, collaboratorId: searchParamsCollaboratorId });
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { collaboratorId, postId } = parsed.data

    const { userId, userClient, error } = await requireUser(req);
    if (error)
      return error;

    const databases = new Databases(userClient);

    const ownerCheck = await databases.listDocuments(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("userId", userId),
        Query.equal("posts", postId),
        Query.equal("role", "owner"),
      ]
    );

    if (ownerCheck.documents.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (collaboratorId === userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Owner cannot be removed from the post" },
        { status: 400 }
      );
    }

    const collaboratorDocs = await databases.listDocuments(
      db.dbID,
      db.postCollaborators,
      [
        Query.equal("userId", collaboratorId),
        Query.equal("posts", postId),
        Query.equal("role", "editor"),
      ]
    );

    if (collaboratorDocs.total === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "User is not a collaborator on this post" },
        { status: 400 }
      );
    }

    const collaboratorDoc = collaboratorDocs.documents[0];

    await databases.deleteDocument(
      db.dbID,
      db.postCollaborators,
      collaboratorDoc.$id
    );

    return NextResponse.json<ApiResponse<{ removed: boolean }>>({
      success: true,
      data: { removed: true },
    });
  } catch (err) {
    console.error("Error removing collaborator: ", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}