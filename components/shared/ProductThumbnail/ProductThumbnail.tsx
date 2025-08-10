'use client'

import React from 'react'
import Image from 'next/image'

export interface ProductThumbnailProps {
  imageUrl?: string | null
  title: string
  width: number
  height: number
  wrapperClassName?: string
  imageClassName?: string
  placeholderClassName?: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
}

export default function ProductThumbnail({
  imageUrl,
  title,
  width,
  height,
  wrapperClassName,
  imageClassName,
  placeholderClassName,
  priority = false,
  loading = 'lazy',
}: ProductThumbnailProps): JSX.Element {
  if (!title) {
    throw new Error('ProductThumbnail: title is required')
  }
  const initials = title.substring(0, 2).toUpperCase()
  return (
    <div className={wrapperClassName}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          className={imageClassName}
          width={width}
          height={height}
          priority={priority}
          loading={loading}
        />)
      : (
        <div className={placeholderClassName}>
          <span>{initials}</span>
        </div>
      )}
    </div>
  )
}
