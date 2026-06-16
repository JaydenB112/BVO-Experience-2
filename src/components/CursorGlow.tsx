import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const outerPosRef = useRef({ x: -100, y: -100 })
  const frameRef = useRef<number>()
  const isHoveringRef = useRef(false)

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      const target = e.target as HTMLElement
      isHoveringRef.current = !!(
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.planet !== undefined ||
        target.closest('[data-planet]')
      )
    }

    const animate = () => {
      // Inner cursor: snaps to mouse immediately
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${posRef.current.x - 10}px, ${posRef.current.y - 10}px) scale(${isHoveringRef.current ? 1.8 : 1})`
      }
      // Outer cursor: lags behind with lerp
      outerPosRef.current.x += (posRef.current.x - outerPosRef.current.x) * 0.12
      outerPosRef.current.y += (posRef.current.y - outerPosRef.current.y) * 0.12
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPosRef.current.x - 20}px, ${outerPosRef.current.y - 20}px) scale(${isHoveringRef.current ? 1.5 : 1})`
      }
      frameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="cursor-glow fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          transition: 'transform 0.05s ease-out, opacity 0.3s',
        }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="cursor-glow fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)',
          boxShadow: '0 0 10px rgba(255,255,255,0.5)',
          transition: 'transform 0.15s ease-out',
        }}
      />
    </>
  )
}
