'use client';

import { useParams } from 'next/navigation';

import React, { useEffect } from 'react';

import { EditorContent } from '@tiptap/react';

import { client } from '@/lib/appwrite-client';
import db from '@/lib/db';
import { useQueryClient } from '@tanstack/react-query';

import { useGetPostDetailsById } from '@/hooks/api/post/useGetPostDetailsById';
import { usePostEditor } from '@/hooks/usePostEditor';

import { PostDB } from '@/types/post';

import NotFoundPage from '@/app/not-found';
import EditPostHeader from '@/components/post/edit/post-header';
import EditPostToolbar from '@/components/post/edit/post-toolbar';
import Loading from '@/components/shared/loading';
import { Card } from '@/components/ui/card';

const PostEditPage = () => {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const {
    data: post,
    isLoading,
    isFetching,
    isError,
  } = useGetPostDetailsById({
    postId,
  });
  const queryClient = useQueryClient();
  const { editor, save, isSaving } = usePostEditor(post?.content, post?.$id)

  useEffect(() => {
    if (!post)
      return;

    const unsubscribe = client.subscribe(
      `databases.${db.dbID}.tables.${db.posts}.rows.${post.$id}`,
      (event) => {
        if (event.events.includes('databases.*.tables.*.rows.*.update')) {
          const updatedDoc = event.payload as PostDB;

          if (editor && updatedDoc.content && updatedDoc.content !== editor.getHTML()) {
            editor.commands.setContent(updatedDoc.content);
          }

          queryClient.setQueryData(["post-details", post.$id], (old: any) => {
            if (!old)
              return updatedDoc;

            return {
              ...old,
              title: updatedDoc.title,
              summary: updatedDoc.summary,
              content: updatedDoc.content,
              category: updatedDoc.category,
              postCollaborators: old.postCollaborators,
            };
          });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [post]);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (isError || !post) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4">
      <Card className="flex-1 flex flex-col border bg-card shadow-md h-[80vh] gap-1 py-4">
        <EditPostHeader
          title={post.title}
          summary={post.summary}
          category={post.category}
          collaborators={post.postCollaborators.collaborators}
          onSave={save}
          isSaving={isSaving}
        />

        <EditPostToolbar editor={editor} />

        <div
          className="flex-1 overflow-y-auto px-6"
          onClick={() => {
            if (editor && !editor.isFocused) {
              editor.commands.focus();
            }
          }}
        >
          <EditorContent editor={editor} className="prose max-w-none" />
        </div>
      </Card>
    </div>
  );
};

export default PostEditPage;
