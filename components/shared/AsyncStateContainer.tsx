'use client'

import React from 'react'

interface AsyncStateContainerProps {
  loading: boolean
  error: string | null
  empty: boolean
  loadingMessage: string
  errorMessage: string
  emptyMessage: string
  children: JSX.Element
}

export default function AsyncStateContainer({
  loading,
  error,
  empty,
  loadingMessage,
  errorMessage,
  emptyMessage,
  children,
}: AsyncStateContainerProps): JSX.Element {
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p>{loadingMessage}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ color: 'var(--color-error)', padding: '1rem', textAlign: 'center' }}>
        <p>{errorMessage} {error}</p>
      </div>
    )
  }

  if (empty) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return children
}
