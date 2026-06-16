import { useEffect } from 'react'

interface UseKeyboardNavProps {
  currentFrame: number
  onFrameChange: (frame: number) => void
  onEscape?: () => void
  disabled?: boolean
}

export function useKeyboardNav({
  currentFrame,
  onFrameChange,
  onEscape,
  disabled = false,
}: UseKeyboardNavProps) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          if (currentFrame < 3) onFrameChange(currentFrame + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          if (currentFrame > 0) onFrameChange(currentFrame - 1)
          break
        case '1':
          onFrameChange(0)
          break
        case '2':
          onFrameChange(1)
          break
        case '3':
          onFrameChange(2)
          break
        case '4':
          onFrameChange(3)
          break
        case 'Escape':
          onEscape?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentFrame, onFrameChange, onEscape, disabled])
}
