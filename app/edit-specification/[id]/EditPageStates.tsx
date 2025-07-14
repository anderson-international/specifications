import { useRouter } from 'next/navigation'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading specification data...' }: LoadingStateProps): JSX.Element {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  error: Error | null
  onReturn?: () => void
}

export function ErrorState({ error, onReturn }: ErrorStateProps): JSX.Element {
  const router = useRouter()

  const handleReturn = (): void => {
    if (onReturn) {
      onReturn()
    } else {
      router.push('/specifications')
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Error loading specification: {error?.message || 'Unknown error'}</p>
      <button onClick={handleReturn}>
        Return to Specifications
      </button>
    </div>
  )
}

interface NotFoundStateProps {
  onReturn?: () => void
}

export function NotFoundState({ onReturn }: NotFoundStateProps): JSX.Element {
  const router = useRouter()

  const handleReturn = (): void => {
    if (onReturn) {
      onReturn()
    } else {
      router.push('/specifications')
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Specification not found</p>
      <button onClick={handleReturn}>
        Return to Specifications
      </button>
    </div>
  )
}
