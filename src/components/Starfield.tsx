import { useEffect, useRef } from 'react'

interface StarfieldProps {
  density?: number
  speed?: number
  boosted?: boolean
  tintColor?: string
}

export function Starfield({
  density = 400,
  speed = 0.2,
  boosted = false,
  tintColor = '#FFFFFF',
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boostedRef = useRef(boosted)
  const tintRef = useRef(tintColor)

  useEffect(() => {
    boostedRef.current = boosted
  }, [boosted])

  useEffect(() => {
    tintRef.current = tintColor
  }, [tintColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: { x: number; y: number; size: number; alpha: number; baseSpeed: number }[] = []
    let speedMult = 1

    const hexToRgb = (hex: string) => {
      const cleaned = hex.replace('#', '')
      const r = parseInt(cleaned.slice(0, 2), 16)
      const g = parseInt(cleaned.slice(2, 4), 16)
      const b = parseInt(cleaned.slice(4, 6), 16)
      return { r: isNaN(r) ? 255 : r, g: isNaN(g) ? 255 : g, b: isNaN(b) ? 255 : b }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = []
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.3,
          baseSpeed: (Math.random() * 0.5 + 0.1) * speed,
        })
      }
    }

    const draw = () => {
      const targetMult = boostedRef.current ? 8 : 1
      speedMult += (targetMult - speedMult) * 0.05

      const tint = hexToRgb(tintRef.current || '#FFFFFF')

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const star of stars) {
        // Mix white 75% with tint 25%
        const r = Math.round(255 * 0.75 + tint.r * 0.25)
        const g = Math.round(255 * 0.75 + tint.g * 0.25)
        const b = Math.round(255 * 0.75 + tint.b * 0.25)

        // At warp speed draw elongated trail
        if (speedMult > 2) {
          const trailLength = star.baseSpeed * speedMult * 6
          const grad = ctx.createLinearGradient(star.x, star.y, star.x, star.y + trailLength)
          grad.addColorStop(0, `rgba(${r},${g},${b},${star.alpha})`)
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.fillStyle = grad
          ctx.fillRect(star.x - star.size / 2, star.y, star.size, trailLength)
        } else {
          ctx.fillStyle = `rgba(${r},${g},${b},${star.alpha})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Twinkle
        star.alpha += (Math.random() - 0.5) * 0.05
        star.alpha = Math.max(0.1, Math.min(1, star.alpha))

        // Move upward
        star.y -= star.baseSpeed * speedMult

        // Reset when off top
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }
      }
      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [density, speed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  )
}
