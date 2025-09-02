'use client';

import React from 'react';

import { usePostEditor } from '@/hooks/usePostEditor';

import { PostDetails } from '@/types/post';

import { EditorContent } from '@tiptap/react';
import EditPostHeader from './post-header';
import EditPostToolbar from './post-toolbar';

import { Card } from '@/components/ui/card';

const EditPostPage = ({ post }: { post: PostDetails }) => {
  const { editor, form, onSubmit, isSaving, isDirty } = usePostEditor(post)

  return (
    <div className="container mx-auto p-4">
      <Card className="flex-1 flex flex-col border bg-card shadow-md h-[80vh] gap-1 py-4">
        <EditPostHeader
          form={form}
          category={post.category}
          collaborators={post.postCollaborators.collaborators}
          onSave={onSubmit}
          isSaving={isSaving}
          isDirty={isDirty}
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
  )
}

export default EditPostPage 