'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { Editor } from '@tiptap/react';
import { SketchPicker } from "react-color";

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
  Palette,
  Quote,
  Underline as UnderlineIcon,
  X,
} from 'lucide-react';

const EditPostToolbar = ({ editor }: { editor: Editor }) => {
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    h3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
  })
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const applyColor = (color: string) => {
    editor.setEditable(true);

    if (color === "reset") {
      editor.chain().focus().unsetColor().run();
      setShowTextPicker(false);
      return
    }

    editor.chain().focus().unsetColor().setColor(color).run();
  };

  const applyHighlight = (color: string) => {
    editor.setEditable(true);
    if (color === "reset") {
      editor.chain().focus().unsetHighlight().run();
      setShowHighlightPicker(false);
      return;
    }

    editor.chain().focus().unsetHighlight().setMark("highlight", { color }).run();
  };

  const currentTextColor = editor.getAttributes('textStyle')?.color || '#000000';
  const currentHighlightColor = editor.getAttributes('highlight')?.color || '#FFFF00';

  useEffect(() => {
    const update = () => {
      setActive({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        h1: editor.isActive("heading", { level: 1 }),
        h2: editor.isActive("heading", { level: 2 }),
        h3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
        codeBlock: editor.isActive("codeBlock"),
      })
    }

    update()

    editor.on("selectionUpdate", update)
    editor.on("transaction", update)

    return () => {
      editor.off("selectionUpdate", update)
      editor.off("transaction", update)
    }
  }, [editor])

  return (
    <div className="sticky top-16 flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-gray-700 py-3 px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          variant={active.bold ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.italic ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.underline ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          variant={active.h1 ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.h2 ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.h3 ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          variant={active.bulletList ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.orderedList ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.blockquote ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={active.codeBlock ? "gradient" : "ghost"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group flex items-center">
          <Button
            size="sm"
            variant={showTextPicker ? 'gradient' : 'ghost'}
            onClick={() => {
              if (showTextPicker) {
                editor.setEditable(true)
                setShowTextPicker(false)
              } else {
                editor.setEditable(false)
                setShowTextPicker(true)
              }
            }}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Palette />
          </Button>

          {showTextPicker && (
            <div className="absolute top-6 z-50">
              <Button
                onClick={() => applyColor("reset")}
                className="w-full rounded-b-none bg-white text-black border-2 border-b-0 hover:bg-white"
              >
                <X className="w-3 h-3" /> Reset
              </Button>

              <SketchPicker
                color={currentTextColor}
                className='!rounded-t-none !shadow-none border-2'
                onChangeComplete={(c) => applyColor(c.hex)}
              />
            </div>
          )}
        </div>

        <div className="relative group flex items-center">
          <Button
            size="sm"
            variant={showHighlightPicker ? 'gradient' : 'ghost'}
            onClick={() => {
              if (showHighlightPicker) {
                editor.setEditable(true)
                setShowHighlightPicker(false)
              } else {
                editor.setEditable(false)
                setShowHighlightPicker(true)
              }
            }}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Highlighter />
          </Button>

          {showHighlightPicker && (
            <div className="absolute top-6 z-50">
              <Button
                onClick={() => applyHighlight("reset")}
                className="w-full rounded-b-none bg-white text-black border-2 border-b-0 hover:bg-white"
              >
                <X className="w-3 h-3" /> Reset
              </Button>

              <SketchPicker
                color={currentHighlightColor}
                className='!rounded-t-none !shadow-none border-2'
                onChangeComplete={(c) => applyHighlight(c.hex)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPostToolbar