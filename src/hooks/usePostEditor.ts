'use client';

import { useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

import { common, createLowlight } from 'lowlight';

import pickDirty from '@/lib/pickDirty';
import { updatePostSchema, UpdatePostSchemaT } from '@/schema/post';

import { useUpdatePost } from './api/post/useUpdatePost';

import { PostDetails } from '@/types/post';
import { toast } from 'react-toastify';

const lowlight = createLowlight(common);
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', xml);

export function usePostEditor(post: PostDetails) {
  const { $id, content, title, summary, category } = post
  const initialContentRef = useRef(content ?? '');

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
    extensions: [
      StarterKit.configure({ codeBlock: false, link: false, underline: false }),
      Underline,
      Link,
      TextStyle,
      Color,
      Highlight,
      CodeBlockLowlight.configure({ lowlight })
    ],
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
