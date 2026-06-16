import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TERMINAL_LINES = [
  '> DESCENT COMPLETE',
  '> DEPTH: 100%',
  '> THE RIVER TERMINATES HERE',
  '> ENERGY READING: INFINITE',
  '> ALL LAYERS CONVERGE',
  '> KEY STATUS: ACTIVE',
  '> MERIDIAN LOCKED',
]

export function MeridianFrame() {
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < TERMINAL_LINES.length) {
        setTerminalLines(prev => [...prev, TERMINAL_LINES[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black"
    >
      <div className="relative w-[1440px] h-[900px] max-w-full max-h-full shrink-0">

        {/* THE RIVER SPIRAL (overhead) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1440 900" aria-hidden="true">
          <defs>
            <filter id="meridian-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="20" result="blur1" />
              <feGaussianBlur stdDeviation="40" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Main white river */}
          <path
            d="M -200 -200 C 400 -100, 1600 100, 1200 400 C 800 700, 200 500, 400 200 C 600 -100, 1000 100, 800 300 C 600 500, 720 600, 720 700"
            fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round"
            filter="url(#meridian-glow)" className="opacity-90"
          />
          {/* Crimson corona */}
          <path
            d="M -200 -200 C 400 -100, 1600 100, 1200 400 C 800 700, 200 500, 400 200 C 600 -100, 1000 100, 800 300 C 600 500, 720 600, 720 700"
            fill="none" stroke="#FF2020" strokeWidth="40" strokeLinecap="round"
            className="opacity-30 blur-2xl"
          />
          {/* Animated flow particles */}
          <path
            d="M -200 -200 C 400 -100, 1600 100, 1200 400 C 800 700, 200 500, 400 200 C 600 -100, 1000 100, 800 300 C 600 500, 720 600, 720 700"
            fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="1 25" className="animate-flow opacity-70"
          />
        </svg>

        {/* REFLECTIVE PLANE (bottom) */}
        <div className="absolute bottom-0 left-0 w-full h-[400px] z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20" />
          <div className="absolute inset-0 opacity-40 blur-md" style={{ transform: 'scaleY(-1) translateY(100px)' }}>
            <svg className="w-full h-[900px]" viewBox="0 0 1440 900">
              <path
                d="M -200 -200 C 400 -100, 1600 100, 1200 400 C 800 700, 200 500, 400 200 C 600 -100, 1000 100, 800 300 C 600 500, 720 600, 720 700"
                fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,1)_70%)]" />
        </div>

        {/* THE KEY — dead center at y=650 */}
        <div
          className="absolute left-1/2 top-[650px] -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
          aria-label="The Key — Meridian terminus"
        >

          {/* Pulse rings — 3 staggered */}
          {[0, 0.7, 1.4].map((delay, i) => (
            <motion.div
              key={i}
              aria-hidden="true"
              className="absolute rounded-full border border-white/20"
              style={{ width: 40, height: 40 }}
              animate={{ scale: [1, 4], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}

          {/* Crosshair reticle — rotating */}
          <motion.div
            aria-hidden="true"
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ width: 80, height: 80 }}
          >
            {/* Top line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-layer1/60" />
            {/* Bottom line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-layer1/60" />
            {/* Left line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-4 bg-layer1/60" />
            {/* Right line */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-4 bg-layer1/60" />
          </motion.div>

          {/* The KEY orb */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-4 h-4 bg-white rounded-full shadow-[0_0_50px_20px_rgba(255,255,255,1)] z-10"
          />

          {/* Bloom */}
          <div className="absolute w-[100px] h-[40px] bg-white/30 rounded-[100%] blur-xl" aria-hidden="true" />

          {/* Horizontal + Vertical lines */}
          <div className="absolute w-[200px] h-[1px] bg-white/30 blur-sm" aria-hidden="true" />
          <div className="absolute h-[200px] w-[1px] bg-white/30 blur-sm" aria-hidden="true" />
        </div>

        {/* ASCII TERMINAL — bottom left */}
        <div className="absolute bottom-10 left-8 z-40 w-72 glass-panel p-4 rounded-xl font-mono text-[11px] leading-relaxed">
          <div className="text-[9px] tracking-[0.3em] text-white/40 mb-2">TERMINUS LOG</div>
          <div
            ref={terminalRef}
            className="max-h-[120px] overflow-y-auto hide-scrollbar space-y-1"
            aria-live="polite"
            aria-label="Terminus log terminal"
          >
            {terminalLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-green-400/80"
              >
                {line}
              </motion.div>
            ))}
            {terminalLines.length > 0 && (
              <span className="text-green-400 animate-terminal-blink" aria-hidden="true">_</span>
            )}
          </div>
        </div>

        {/* Vignette pulse */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)'
          }}
        />

        {/* UI Overlay — top right */}
        <div className="absolute top-6 right-6 text-right z-40" aria-hidden="true">
          <div className="text-[10px] tracking-[0.3em] text-white/50 mb-1">TERMINUS</div>
          <div className="text-sm tracking-[0.2em] text-white text-shadow-glow font-medium">THE MERIDIAN</div>
        </div>

        {/* Depth indicator */}
        <div className="absolute top-6 left-6 z-40" aria-hidden="true">
          <div className="text-[9px] tracking-[0.3em] text-white/30 mb-1">DEPTH</div>
          <div className="text-2xl font-light text-white text-shadow-glow">100%</div>
        </div>
      </div>
    </motion.div>
  )
}
