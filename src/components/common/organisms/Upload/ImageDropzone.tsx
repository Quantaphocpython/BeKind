'use client'

import { cn } from '@/shared/utils'
import React, { useCallback, useRef, useState } from 'react'

interface ImageDropzoneProps {
  value?: string
  onChange?: (value: { objectUrl: string; file: File } | null) => void
  disabled?: boolean
  className?: string
  accept?: string
  maxSizeMb?: number
  previewAspect?: number
  placeholder?: string
  height?: number
}

const ImageDropzone = ({
  value,
  onChange,
  disabled,
  className,
  accept = 'image/*',
  maxSizeMb = 5,
  previewAspect = 16 / 9,
  placeholder = 'Drag & drop your image here, or click to upload',
  height = 300,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      const file = files[0]
      if (file.size > maxSizeMb * 1024 * 1024) {
        return
      }
      const objectUrl = URL.createObjectURL(file)
      onChange?.({ objectUrl, file })
    },
    [maxSizeMb, onChange],
  )

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const openFileDialog = () => {
    if (!disabled) inputRef.current?.click()
  }

  const currentPreview = value

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={openFileDialog}
        role="button"
        aria-disabled={disabled}
        className={cn(
          'group relative border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden',
          'bg-card hover:border-primary/70 border-border',
          dragActive ? 'border-primary' : 'border-border',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <div
          className={cn('relative w-full', height && `max-h-[${height}px] h-full`)}
          style={{ aspectRatio: String(previewAspect) }}
        >
          {/* Image or placeholder */}
          {currentPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentPreview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
              <div className="text-sm text-muted-foreground">{placeholder}</div>
            </div>
          )}

          {/* Hover overlay */}
          {currentPreview && (
            <div className="absolute inset-0 hidden items-center justify-center bg-black/40 px-4 text-center text-sm text-white group-hover:flex">
              <span>{placeholder}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageDropzone
