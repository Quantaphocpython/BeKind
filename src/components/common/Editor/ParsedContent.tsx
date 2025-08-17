'use client'

import 'react-image-crop/dist/ReactCrop.css'
import 'reactjs-tiptap-editor/style.css'

interface ParsedFaqContentProps {
  htmlContent: string
}

const ParsedContent = ({ htmlContent }: ParsedFaqContentProps) => {
  // If no HTML tags are present, wrap with <div>
  const rawContent = !/<[a-z][\s\S]*>/i.test(htmlContent) ? `<div>${htmlContent}</div>` : htmlContent

  return (
    <div className="reactjs-tiptap-editor">
      <div className="richtext-relative ">
        <div className="tiptap ProseMirror parsed-content" dangerouslySetInnerHTML={{ __html: rawContent }}></div>
      </div>
    </div>
  )
}

export default ParsedContent
