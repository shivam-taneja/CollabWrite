'use client';

import { mockPost } from '@/utils/constants';
import React, { useCallback } from 'react';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', xml);

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Save,
  Underline as UnderlineIcon,
} from 'lucide-react';

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const applyHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-muted pb-3 mb-4">
      {/* Basic formatting */}
      <Button
        size="sm"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('underline') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>

      {/* Headings */}
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      {/* Lists */}
      <Button
        size="sm"
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      {/* Quotes & Code */}
      <Button
        size="sm"
        variant={editor.isActive('blockquote') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="w-4 h-4" />
      </Button>

      {/* Color picker */}
      <input
        type="color"
        onChange={(e) => applyColor(e.target.value)}
        className="w-8 h-8 cursor-pointer border rounded"
        title="Text Color"
      />

      {/* Highlight picker */}
      <input
        type="color"
        onChange={(e) => applyHighlight(e.target.value)}
        className="w-8 h-8 cursor-pointer border rounded"
        title="Highlight"
      />
    </div>
  );
};

const PostEditPage = () => {
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
    content: mockPost.content,
    immediatelyRender: false,
  });

  const handleSave = useCallback(() => {
    if (editor) {
      const html = editor.getHTML(); // 👈 Save this clean HTML
      console.log(html);
      alert('Post saved!');
    }
  }, [editor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 py-10">
      <div className="container max-w-5xl mx-auto px-4">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-10">
            <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
            <Toolbar editor={editor} />
            <div
              className="
    prose prose-lg max-w-none
    prose-headings:scroll-m-20 prose-headings:font-semibold
    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
    prose-p:leading-7
    prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline
    prose-blockquote:border-l-primary
    prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
    prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg
  "
            >
              <EditorContent editor={editor} />
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostEditPage;
