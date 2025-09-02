import { QueryClient } from "@tanstack/react-query";

import { client } from "@/lib/appwrite-client";
import db from "@/lib/db";
import { updatePostInCache } from "@/lib/updatePostInCache";

import { PostDB } from "@/types/post";

export function subscribeToPostDetails(
  queryClient: QueryClient,
  postId: string
) {
  const unsubscribe = client.subscribe(
    `databases.${db.dbID}.tables.${db.posts}.rows.${postId}`,
    (event) => {
      if (event.events.includes("databases.*.tables.*.rows.*.update")) {
        const updatedDoc = event.payload as PostDB;

        // Update cache with new fields
        updatePostInCache(queryClient, updatedDoc);
      }

      if (event.events.includes("databases.*.tables.*.rows.*.delete")) {
        // Post was deleted -> clear details cache
        queryClient.invalidateQueries({ queryKey: ["post-details", postId] });
      }
    }
  );

  return unsubscribe;
}
