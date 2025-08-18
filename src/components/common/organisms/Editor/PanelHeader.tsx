'use client'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'

interface PanelHeaderProps {
  isExpanded: boolean
  onToggle: () => void
  disabled?: boolean
  isEditor?: boolean
}

const PanelHeader = ({ isExpanded, onToggle, disabled = false, isEditor = true }: PanelHeaderProps) => {
  const ChevronIcon = isEditor
    ? isExpanded
      ? Icons.chevronLeft
      : Icons.chevronRight
    : isExpanded
      ? Icons.chevronRight
      : Icons.chevronLeft

  const title = isEditor ? 'Content' : 'Preview'

  return (
    <div className="flex items-center justify-between p-3 bg-muted border-b border-border">
      {isEditor ? (
        <>
          <div className="flex items-center gap-2">
            {isExpanded && <Label className="text-sm  font-medium">{title}</Label>}
          </div>
          <button
            data-test="content-editor-toggle"
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`
              flex items-center justify-center p-1 rounded hover:bg-accent transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isExpanded ? 'Collapse editor' : 'Expand editor'}
          >
            <ChevronIcon size={16} className="text-muted-foreground" />
          </button>
        </>
      ) : (
        <>
          <button
            data-test="content-editor-toggle"
            type="button"
            onClick={onToggle}
            disabled={disabled}
            className={`
              flex items-center justify-center p-1 rounded hover:bg-accent transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isExpanded ? 'Collapse preview' : 'Expand preview'}
          >
            <ChevronIcon size={16} className="text-muted-foreground" />
          </button>
          {isExpanded && <Label className="text-sm  font-medium">{title}</Label>}
        </>
      )}
    </div>
  )
}

export default PanelHeader
