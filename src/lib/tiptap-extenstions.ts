'use client';

import { ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

import { common, createLowlight } from 'lowlight';

import BlockQuoteComponent from '@/components/post/edit/tiptap/block-quote';
import CodeBlockComponent from '@/components/post/edit/tiptap/code-block';

const lowlight = createLowlight(common);
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', xml);

export const getExtensions = () => [
  StarterKit.configure({ codeBlock: false, link: false, underline: false }),
  Underline,
  Link, // TODO: add link support
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  CodeBlockLowlight.extend({
    addAttributes() {
      return {
        language: {
          default: "plaintext",
        }
      }
    },
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockComponent)
    },
  }).configure({ lowlight }),
  Blockquote.extend({
    addNodeView() {
      return ReactNodeViewRenderer(BlockQuoteComponent)
    },
  })
]