'use client'

import { cn } from '@/shared/utils'
import 'react-image-crop/dist/ReactCrop.css'
// import 'reactjs-tiptap-editor/style.css'

interface ParsedFaqContentProps {
  htmlContent: string
  className?: string
  contentClassName?: string
}

const ParsedContent = ({ htmlContent, className, contentClassName }: ParsedFaqContentProps) => {
  const rawContent = !/<[a-z][\s\S]*>/i.test(htmlContent) ? `<div>${htmlContent}</div>` : htmlContent

  return (
    <div className={cn('reactjs-tiptap-editor', className)}>
      {/* <div className="richtext-relative "> */}
      <div
        className={cn('tiptap parsed-content ', contentClassName)}
        dangerouslySetInnerHTML={{ __html: rawContent }}
      ></div>
      {/* </div> */}
    </div>
  )
}

export default ParsedContent
