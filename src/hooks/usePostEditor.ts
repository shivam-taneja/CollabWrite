'use client';

import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useEditor } from '@tiptap/react';

import pickDirty from '@/lib/pickDirty';
import { getExtensions } from '@/lib/tiptap-extenstions';
import { updatePostSchema, UpdatePostSchemaT } from '@/schema/post';

import { useUpdatePost } from './api/post/useUpdatePost';

import { PostDetails } from '@/types/post';
import { toast } from 'react-toastify';

export function usePostEditor(post: PostDetails) {
  const { $id, content, title, summary, category } = post
  const initialContentRef = useRef(content);

  const [isContentDirty, setIsContentDirty] = useState(false);

  const form = useForm<UpdatePostSchemaT>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title,
      summary,
      postId: $id,
      content,
      category
    },
    mode: 'all'
  });

  const { mutateAsync, isPending } = useUpdatePost();

  const editor = useEditor({
    extensions: getExtensions(),
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setIsContentDirty(editor.getHTML() !== initialContentRef.current);
    }
  });

  useEffect(() => {
    form.reset({
      title: post.title,
      summary: post.summary,
      postId: post.$id,
      content: post.content,
      category: post.category,
    });

    if (editor && post.content) {
      editor.commands.setContent(post.content);
      initialContentRef.current = post.content;
      setIsContentDirty(false);
    }
  }, [post, form, editor]);

  const { dirtyFields } = form.formState;

  async function onSubmit(values: UpdatePostSchemaT) {
    // Build minimal payload
    const changedValues = pickDirty(values, dirtyFields);

    // Check editor content separately
    const html = editor?.getHTML();
    if (html && html !== initialContentRef.current) {
      changedValues.content = html;
    }

    if (Object.keys(changedValues).length === 0) {
      return;
    }

    try {
      await mutateAsync({ postId: $id, ...changedValues });

      form.reset(values);

      if (changedValues.content) {
        initialContentRef.current = changedValues.content;
      }
      toast.success('Post saved!');
    } catch {
      toast.error('Error saving post');
    }
  }

  return {
    editor,
    form,
    onSubmit,
    isSaving: isPending,
    isDirty: Object.keys(dirtyFields).length > 0 || isContentDirty
  };
}
