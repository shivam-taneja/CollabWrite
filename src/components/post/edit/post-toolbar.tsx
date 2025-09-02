'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Underline as UnderlineIcon,
} from 'lucide-react';

const EditPostToolbar = ({ editor }: { editor: any }) => {
  if (!editor)
    return null;

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const applyHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-muted py-2 px-6 bg-background z-10">
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
      <input
        type="color"
        onChange={(e) => applyColor(e.target.value)}
        className="w-8 h-8 cursor-pointer border rounded"
        title="Text Color"
      />
      <input
        type="color"
        onChange={(e) => applyHighlight(e.target.value)}
        className="w-8 h-8 cursor-pointer border rounded"
        title="Highlight"
      />
    </div>
  );
}

export default EditPostToolbar