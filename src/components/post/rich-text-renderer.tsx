import { EditorContent, useEditor } from '@tiptap/react';

import { getExtensions } from '@/lib/tiptap-extenstions';

const RichTextRenderer = ({ html }: { html: string }) => {
  const editor = useEditor({
    extensions: getExtensions(),
    content: html,
    editable: false,
    immediatelyRender: false
  })

  return (
    <div className="prose">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextRenderer