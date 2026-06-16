import { useEffect, useRef } from 'react'

interface UseScrollFrameProps {
  currentFrame: number
  onFrameChange: (frame: number) => void
  disabled?: boolean
}

export function useScrollFrame({
  currentFrame,
  onFrameChange,
  disabled = false,
}: UseScrollFrameProps) {
  const cooldownRef = useRef(false)
  const currentFrameRef = useRef(currentFrame)

  useEffect(() => {
    currentFrameRef.current = currentFrame
  }, [currentFrame])

  useEffect(() => {
    if (disabled) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (cooldownRef.current) return

      const delta = e.deltaY
      if (Math.abs(delta) < 30) return // ignore tiny scrolls

      cooldownRef.current = true
      setTimeout(() => { cooldownRef.current = false }, 700)

      if (delta > 0 && currentFrameRef.current < 3) {
        onFrameChange(currentFrameRef.current + 1)
      } else if (delta < 0 && currentFrameRef.current > 0) {
        onFrameChange(currentFrameRef.current - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [onFrameChange, disabled])
}
