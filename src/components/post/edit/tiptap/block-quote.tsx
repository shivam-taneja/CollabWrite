import type { NodeViewProps } from "@tiptap/react"
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react"

const BlockQuoteComponent: React.FC<NodeViewProps> = () => {
  return (
    <NodeViewWrapper
      as="blockquote"
      className="flex gap-4 items-center"
    >
      <div className="rounded-sm border-l-4 border-gray-300 h-8" /> 
      <NodeViewContent className="italic" />
    </NodeViewWrapper>
  )
}

export default BlockQuoteComponent