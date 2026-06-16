import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PlanetFrameProps {
  onDescend: () => void
}

// ─── Animated stat counter hook ──────────────────────────────────────────────
function useCountUp(target: number, duration: number = 1500): number {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    startRef.current = null
    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      }
    }
    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return value
}

function useCountUpFloat(target: number, decimals: number = 1, duration: number = 1500): string {
  const [value, setValue] = useState('0.' + '0'.repeat(decimals))
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    startRef.current = null
    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue((target * eased).toFixed(decimals))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      }
    }
    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, decimals, duration])

  return value
}

export function PlanetFrame({ onDescend }: PlanetFrameProps) {
  const [loading, setLoading] = useState(false)
  const [flashVisible, setFlashVisible] = useState(false)

  const temp = useCountUp(1420, 1500)
  const proximity = useCountUpFloat(0.4, 1, 1800)

  const handleDescend = () => {
    setLoading(true)
    setFlashVisible(true)
    setTimeout(() => {
      setFlashVisible(false)
      onDescend()
    }, 400)
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {flashVisible && (
          <motion.div
            className="absolute inset-0 bg-layer1 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Background river SVG ─────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pfRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5C842" stopOpacity="0" />
            <stop offset="40%" stopColor="#F5C842" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#2ECFCF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0" />
          </linearGradient>
          <filter id="pfBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <path
          d="M -100 700 Q 300 600 600 500 Q 800 440 1000 380 Q 1200 320 1540 200"
          fill="none"
          stroke="url(#pfRiverGrad)"
          strokeWidth="3"
          filter="url(#pfBlur)"
          className="animate-flow"
          strokeDasharray="1000"
        />
        {/* Ambient amber glow behind planet */}
        <radialGradient id="pfAmbient" cx="35%" cy="50%" r="45%">
          <stop offset="0%" stopColor="#F5C842" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#F5C842" stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="1440" height="900" fill="url(#pfAmbient)" />
      </svg>

      {/* ── Giant Aurentum planet ────────────────────────────────────────── */}
      <div className="absolute left-[28%] top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        {/* Outer atmosphere haze */}
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full"
          style={{
            width: 420,
            height: 420,
            background: 'radial-gradient(circle, rgba(245,200,66,0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%) scale(1.5)',
            left: '50%',
            top: '50%',
          }}
        />

        {/* Planet body */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
          style={{ width: 340, height: 340 }}
        >
          <div
            className="rounded-full w-full h-full relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 32% 28%, #F5C842, #C08010, #5B3A00, #1A0E00)',
              boxShadow: `
                inset -20px -20px 40px rgba(0,0,0,0.9),
                inset 10px 10px 30px rgba(245,200,66,0.3),
                0 0 120px rgba(245,200,66,0.25),
                0 0 60px rgba(245,200,66,0.15)
              `,
            }}
          >
            {/* Surface banding */}
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: `repeating-linear-gradient(
                  -15deg,
                  transparent 0px,
                  transparent 18px,
                  rgba(200,140,0,0.4) 18px,
                  rgba(200,140,0,0.4) 22px
                )`,
              }}
            />
            {/* Specular highlight */}
            <div
              className="absolute rounded-full opacity-30"
              style={{
                top: '12%',
                left: '18%',
                width: '40%',
                height: '35%',
                background: 'radial-gradient(ellipse, rgba(255,240,180,0.8), transparent)',
                filter: 'blur(8px)',
              }}
            />
            {/* Inner glow mix */}
            <div
              className="absolute inset-0 rounded-full mix-blend-screen opacity-40"
              style={{
                boxShadow: 'inset 0 0 80px rgba(245,200,66,0.6)',
              }}
            />
          </div>

          {/* Orbit rings */}
          <svg
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              height: 500,
            }}
            viewBox="0 0 500 500"
            aria-hidden="true"
          >
            <motion.ellipse
              cx="250" cy="250" rx="210" ry="55"
              fill="none"
              stroke="rgba(245,200,66,0.15)"
              strokeWidth="1"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '250px 250px' }}
            />
            <motion.ellipse
              cx="250" cy="250" rx="170" ry="40"
              fill="none"
              stroke="rgba(245,200,66,0.10)"
              strokeWidth="0.5"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '250px 250px' }}
            />
            <motion.ellipse
              cx="250" cy="250" rx="240" ry="68"
              fill="none"
              stroke="rgba(245,200,66,0.06)"
              strokeWidth="1.5"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '250px 250px' }}
            />
          </svg>
        </motion.div>
      </div>

      {/* ── Lore panel ───────────────────────────────────────────────────── */}
      <motion.div
        className="absolute right-12 top-1/2 -translate-y-1/2 w-[380px] glass-panel rounded-2xl p-8 z-20"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Accent bar */}
        <div
          className="h-[1px] w-full mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.6), transparent)' }}
          aria-hidden="true"
        />

        {/* Title */}
        <div className="text-[9px] tracking-[0.4em] text-layer1/60 mb-2">LAYER 1 · ORBIT 1</div>
        <h2 className="text-4xl font-light tracking-wider text-white mb-1">AURENTUM</h2>
        <div className="text-[10px] tracking-[0.25em] text-layer1/70 mb-6">
          THE ANCIENT WORLD
        </div>

        {/* Lore text */}
        <p className="text-sm text-white/65 leading-relaxed mb-3">
          The oldest world in the Familiar Skies. Its burnished surface holds the records of the
          first descent, etched into the golden crust by forces that predate the rings.
        </p>
        <p className="text-sm text-white/65 leading-relaxed mb-6">
          Atmospheric density is high, rich in amber particulate that catches the light of The
          River as it passes overhead. It feels solid, ancient, and undeniably important.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-panel rounded-lg p-3">
            <div className="text-[8px] tracking-[0.2em] text-white/40 mb-1">SURFACE TEMP</div>
            <div className="text-sm font-medium text-white font-mono">
              {temp.toLocaleString()}°K
            </div>
          </div>
          <div className="glass-panel rounded-lg p-3">
            <div className="text-[8px] tracking-[0.2em] text-white/40 mb-1">RIVER PROXIMITY</div>
            <div className="text-sm font-medium text-layer1 font-mono">{proximity} AU</div>
          </div>
          <div className="glass-panel rounded-lg p-3">
            <div className="text-[8px] tracking-[0.2em] text-white/40 mb-1">AGE ESTIMATE</div>
            <div className="text-sm font-medium text-white">14.2 Gyr</div>
          </div>
          <div className="glass-panel rounded-lg p-3">
            <div className="text-[8px] tracking-[0.2em] text-white/40 mb-1">GRAVITY</div>
            <div className="text-sm font-medium text-white">2.3× std</div>
          </div>
        </div>

        {/* Descent CTA */}
        <motion.button
          onClick={handleDescend}
          disabled={loading}
          className="w-full py-3 rounded-xl text-xs tracking-[0.3em] font-medium transition-all duration-300 border border-layer1/40 text-layer1 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          animate={loading ? { scale: [1, 0.97, 1] } : {}}
          transition={loading ? { duration: 0.4 } : {}}
          style={{}}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(245,200,66,0.12)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(245,200,66,0.2)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {loading ? 'INITIATING…' : 'INITIATE DESCENT'}
        </motion.button>

        {/* Bottom accent */}
        <div
          className="h-[1px] w-full mt-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.3), transparent)' }}
          aria-hidden="true"
        />
      </motion.div>

      {/* ── Frame label ──────────────────────────────────────────────────── */}
      <div className="absolute top-8 right-20 z-30 text-right" aria-hidden="true">
        <div className="text-[8px] tracking-[0.4em] text-white/20 mb-1">FRAME · 02</div>
        <div className="text-[8px] tracking-[0.4em] text-layer1/50">AURENTUM CLOSE-UP</div>
      </div>
    </motion.div>
  )
}
