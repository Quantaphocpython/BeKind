'use client'

import { cn } from '@/shared/utils'
import { useEffect, useState } from 'react'
import PanelHeader from './PanelHeader'
import ParsedContent from './ParsedContent'
import RichEditor from './RichEditor'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  showPreview?: boolean
  className?: string
}

const Editor = ({ value, onChange, error, disabled = false, showPreview = true, className }: ContentEditorProps) => {
  const [isEditorExpanded, setIsEditorExpanded] = useState(true)
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(showPreview)

  // Prevent both panels from being collapsed
  useEffect(() => {
    if (!isEditorExpanded && !isPreviewExpanded && showPreview) {
      setIsEditorExpanded(true)
    }
  }, [isEditorExpanded, isPreviewExpanded, showPreview])

  const editorWidth = !showPreview || !isPreviewExpanded ? 'w-full' : !isEditorExpanded ? 'w-12' : 'w-1/2'

  const previewWidth = !showPreview ? 'w-0' : !isEditorExpanded ? 'w-full' : !isPreviewExpanded ? 'w-12' : 'w-1/2'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Editor Container */}
      <div className="flex border rounded-lg overflow-hidden bg-card">
        {/* Editor Panel */}
        <div
          className={`
          relative transition-all duration-300 ease-in-out 
          ${showPreview ? 'border-r border-border' : ''}
          ${editorWidth}
        `}
        >
          <PanelHeader
            isExpanded={isEditorExpanded}
            onToggle={() => setIsEditorExpanded(!isEditorExpanded)}
            disabled={disabled}
            isEditor={true}
          />

          {isEditorExpanded && (
            <div className={`h-full min-h-64 p-3 overflow-auto ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
              <RichEditor key={value ? 'filled' : 'empty'} content={value || ''} setContent={onChange} />
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className={`relative transition-all duration-300 ease-in-out ${previewWidth}`}>
            <PanelHeader
              isExpanded={isPreviewExpanded}
              onToggle={() => setIsPreviewExpanded(!isPreviewExpanded)}
              disabled={disabled}
              isEditor={false}
            />

            {isPreviewExpanded && (
              <div className="min-h-64 p-3 overflow-auto">
                {value ? <ParsedContent htmlContent={value} /> : <p></p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}

export default Editor
