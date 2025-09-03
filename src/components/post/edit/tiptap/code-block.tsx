import { NodeViewContent, NodeViewWrapper, } from "@tiptap/react"

import type { NodeViewProps } from "@tiptap/react"

const CodeBlockComponent: React.FC<NodeViewProps> = ({ node }) => {
  const lang: string = (node.attrs.language as string) || "plaintext"

  return (
    <NodeViewWrapper className="code-block">
      <div className="code-block-header">
        <span>{lang}</span>
      </div>
      <pre>
        <code className={`language-${lang}`} spellCheck={false}>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  )
}

export default CodeBlockComponent