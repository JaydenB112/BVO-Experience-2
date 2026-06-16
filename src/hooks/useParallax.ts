import { useCallback, useEffect, useRef } from 'react'

const DEPTH_MULTIPLIERS = [0.1, 0.25, 0.5, 0.8, 1.0, 1.2]
const MAX_OFFSET = 30

export function useParallax() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 from center
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const lerp = () => {
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.08
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.08
      frameRef.current = requestAnimationFrame(lerp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    frameRef.current = requestAnimationFrame(lerp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const getOffset = useCallback((depth: 0 | 1 | 2 | 3 | 4 | 5) => {
    const multiplier = DEPTH_MULTIPLIERS[depth]
    return {
      x: currentRef.current.x * MAX_OFFSET * multiplier,
      y: currentRef.current.y * MAX_OFFSET * multiplier,
    }
  }, [])

  return { getOffset }
}
