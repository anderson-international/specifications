'use client'

import React from 'react'

interface ProductListProps<T> {
  items: T[]
  getKey: (item: T) => React.Key
  renderItem: (item: T) => React.ReactNode
  containerClassName?: string
  containerStyle?: React.CSSProperties
}

export default function ProductList<T>({
  items,
  getKey,
  renderItem,
  containerClassName,
  containerStyle,
}: ProductListProps<T>): JSX.Element {
  return (
    <div className={containerClassName} style={containerStyle}>
      {items.map((item) => (
        <React.Fragment key={getKey(item)}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  )
}
