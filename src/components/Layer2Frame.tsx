import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// Stable rain particles (computed once at module level — no per-render randomness)
const RAIN_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: 30 + ((i * 17) % 100),
  delay: (i * 0.13) % 1.5,
}))

export function Layer2Frame() {
  const titleRef = useRef<HTMLDivElement>(null)
  const [glitching, setGlitching] = useState(false)
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Random glitch trigger every 3-6 seconds
  const scheduleGlitch = useCallback(() => {
    const delay = 3000 + Math.random() * 3000
    glitchTimerRef.current = setTimeout(() => {
      setGlitching(true)
      setTimeout(() => {
        setGlitching(false)
        scheduleGlitch()
      }, 200)
    }, delay)
  }, [])

  useEffect(() => {
    scheduleGlitch()
    return () => {
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current)
    }
  }, [scheduleGlitch])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
    >
      <div className="relative w-[1440px] h-[900px] max-w-full max-h-full shrink-0">

        {/* Chromatic aberration + violet vignette overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(123,47,190,0.2)_100%)] mix-blend-screen z-30 pointer-events-none"
        />

        {/* Reality distortion blur — pulses */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-30 pointer-events-none"
          animate={{ backdropFilter: ['blur(1px)', 'blur(6px)', 'blur(1px)'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ maskImage: 'radial-gradient(circle, transparent 30%, black 100%)' }}
        />

        {/* THE RIVER (Teal/Violet forking) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1440 900" aria-hidden="true">
          <defs>
            <filter id="layer2-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="l2-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2ECFCF" />
              <stop offset="100%" stopColor="#7B2FBE" />
            </linearGradient>
          </defs>
          <path
            d="M -100 200 C 400 300, 800 100, 1200 500 C 1400 700, 900 900, 500 800"
            fill="none" stroke="url(#l2-grad)" strokeWidth="24" strokeLinecap="round"
            filter="url(#layer2-glow)" className="opacity-80"
          />
          <path
            d="M -100 220 C 380 320, 820 80, 1220 520 C 1420 720, 880 920, 480 820"
            fill="none" stroke="#7B2FBE" strokeWidth="8" strokeLinecap="round"
            filter="url(#layer2-glow)" className="opacity-60 mix-blend-screen"
          />
          {/* Animated dash flow */}
          <path
            d="M -100 200 C 400 300, 800 100, 1200 500 C 1400 700, 900 900, 500 800"
            fill="none" stroke="#2ECFCF" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="1 20" className="animate-flow opacity-60"
          />
        </svg>

        {/* MNEMOVEX — Iridescent planet left */}
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[200px] top-[300px] w-[200px] h-[200px] rounded-full z-20"
          aria-label="MNEMOVEX planet"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #E2E8F0, #7B2FBE, #000)',
            boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.9), 0 0 80px rgba(123,47,190,0.5), 10px 0 20px rgba(46,207,207,0.4)',
          }}
        >
          {/* Iridescent color-shift shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full mix-blend-color-dodge"
            animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'radial-gradient(circle at 70% 70%, rgba(46,207,207,0.6), transparent 60%)'
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full opacity-40 mix-blend-color-dodge"
            style={{ background: 'radial-gradient(circle at 20% 80%, rgba(245,200,66,0.5), transparent 50%)' }}
            aria-hidden="true"
          />
          {/* Label */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] text-white/60 whitespace-nowrap"
            aria-hidden="true"
          >
            MNEMOVEX
          </div>
        </motion.div>

        {/* CAELUNDRA — Cobalt planet right with upward rain */}
        <div className="absolute right-[250px] top-[400px] z-20" aria-label="CAELUNDRA planet">
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-[160px] h-[160px] rounded-full"
            style={{
              background: 'radial-gradient(circle at 60% 40%, #3B82F6, #1E3A8A, #000)',
              boxShadow: 'inset 20px -20px 40px rgba(0,0,0,0.9), 0 0 100px rgba(59,130,246,0.6)',
            }}
          >
            {/* Rotating dashed orbit ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-8 rounded-full border border-blue-400/30"
              style={{ borderStyle: 'dashed' } as React.CSSProperties}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] text-white/60 whitespace-nowrap"
              aria-hidden="true"
            >
              CAELUNDRA
            </div>
          </motion.div>

          {/* Upward rain particles */}
          {RAIN_PARTICLES.map(p => (
            <motion.div
              key={p.id}
              aria-hidden="true"
              className="absolute w-[2px] h-[6px] bg-blue-300/60 rounded-full"
              style={{ left: p.left, bottom: 160 }}
              animate={{ y: [0, -90], opacity: [0.7, 0] }}
              transition={{
                duration: 1.5,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* LAYER 2 UNSTABLE badge — flickers */}
        <motion.div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-1 border border-layer3-crimson/40 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          role="status"
          aria-live="polite"
        >
          <span className="text-[9px] tracking-[0.3em] text-layer3-crimson font-medium">
            LAYER 2 — UNSTABLE
          </span>
        </motion.div>

        {/* UI Overlay — top right */}
        <div className="absolute top-6 right-6 text-right z-40" aria-hidden="true">
          <div className="text-[10px] tracking-[0.3em] text-white/50 mb-1">LAYER 2</div>
          <div
            ref={titleRef}
            className={`text-sm tracking-[0.2em] text-layer2-teal text-shadow-teal font-medium transition-transform animate-rgb-split ${
              glitching ? 'animate-glitch' : ''
            }`}
          >
            THE SHATTERED REALITY
          </div>
        </div>

        {/* Static noise texture overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

      </div>
    </motion.div>
  )
}
