'use client';

import { useCallback, useRef } from 'react';

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

import { UpdatePostDetails } from '@/types/post';
import { common, createLowlight } from 'lowlight';
import { toast } from 'react-toastify';
import { useUpdatePostDetailsById } from './api/post/useUpdatePostDetailsById';

const lowlight = createLowlight(common);
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', xml);

export function usePostEditor(content?: string, postId?: string) {
  const initialContentRef = useRef(content ?? '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
        underline: false,
      }),
      Underline,
      Link,
      TextStyle,
      Color,
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    immediatelyRender: false,
  });

  const {
    mutateAsync,
    isPending
  } = useUpdatePostDetailsById()

  const save = async ({ updatedDetails }: { updatedDetails: Partial<UpdatePostDetails> }) => {
    if (!editor || !postId)
      return;

    const payload: Partial<UpdatePostDetails> = { ...updatedDetails };

    const html = editor.getHTML();

    // Only include content if it changed
    if (html !== initialContentRef.current) {
      payload.content = html;
    }

    // If nothing changed, skip request
    if (Object.keys(payload).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      await mutateAsync({
        postId,
        updatedDetails
      });

      // Update reference so future saves only detect new changes
      if (payload.content !== undefined) {
        initialContentRef.current = payload.content;
      }

      toast.success('Post saved!');
    } catch (err) {
      toast.error('Error saving post');
    }
  };

  return { editor, save, isSaving: isPending }
}
