import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Planet } from '../types'

interface PlanetCloseupViewProps {
  planet: Planet
  onClose: () => void
  onDescend?: () => void
}

/** Animates a number from 0 to target over `duration` ms */
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

/** Parse first numeric value from a stat string for the counter */
function parseNumeric(val: string): number {
  const match = val.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

export function PlanetCloseupView({ planet, onClose, onDescend }: PlanetCloseupViewProps) {
  const [descending, setDescending] = useState(false)
  const [flashVisible, setFlashVisible] = useState(false)

  // Animated stat values — first two stats get count-up treatment
  const stat0Num = parseNumeric(planet.lore.stats[0]?.value ?? '0')
  const stat1Num = parseNumeric(planet.lore.stats[1]?.value ?? '0')
  const count0 = useCountUp(stat0Num, 1600)
  const count1 = useCountUp(stat1Num, 1800)

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleDescend = () => {
    setDescending(true)
    setFlashVisible(true)
    setTimeout(() => setFlashVisible(false), 200)
    setTimeout(() => {
      setDescending(false)
      onDescend?.()
    }, 450)
  }

  // Format count-up value to match original string format
  const formatStat = (original: string, count: number): string => {
    if (original.includes(',')) return count.toLocaleString()
    if (original.includes('.') && count < 100) return (count / 10).toFixed(1)
    return String(count)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed inset-0 z-[200] bg-space overflow-hidden flex items-center justify-center"
    >
      {/* Flash overlay on descend */}
      {flashVisible && (
        <div className="absolute inset-0 z-50 bg-white/20 pointer-events-none" />
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close planet view"
        className="absolute top-6 right-6 z-50 text-white/40 hover:text-white transition-colors duration-300 text-xl leading-none"
      >
        ✕
      </button>

      <div className="relative w-[1440px] h-[900px] max-w-full max-h-full shrink-0 flex items-center">

        {/* ── GIANT PLANET (left) ─────────────────────────────── */}
        <div className="absolute -left-[200px] top-1/2 -translate-y-1/2 w-[1000px] h-[1000px]">
          {/* Atmospheric glow */}
          <div
            className="absolute inset-0 rounded-full blur-[120px]"
            style={{ background: `${planet.glow}33` }}
          />

          {/* Planet body */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 30%, ${planet.color1} 0%, ${planet.color2} 40%, #000000 100%)`,
              boxShadow: `inset -40px -40px 100px rgba(0,0,0,0.9), 0 0 150px ${planet.glow}4D`,
            }}
          >
            {/* Banding texture */}
            <div
              className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.2) 20px, rgba(0,0,0,0.2) 40px)',
              }}
            />
          </motion.div>

          {/* Atmosphere edge */}
          <div
            className="absolute inset-0 rounded-full blur-sm mix-blend-screen"
            style={{ border: `4px solid ${planet.glow}4D` }}
          />

          {/* Orbit rings */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 1000 1000"
          >
            <motion.ellipse
              cx="500" cy="500" rx="520" ry="80"
              fill="none" stroke={planet.glow} strokeWidth="1"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '500px 500px' }}
            />
            <motion.ellipse
              cx="500" cy="500" rx="560" ry="110"
              fill="none" stroke={planet.glow} strokeWidth="0.5"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '500px 500px' }}
            />
          </svg>
        </div>

        {/* River glow passing behind */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-10"
          viewBox="0 0 1440 900"
        >
          <path
            d="M 800 -100 C 900 300, 600 600, 400 1000"
            fill="none"
            stroke={planet.glow}
            strokeWidth="40"
            strokeLinecap="round"
            className="opacity-10 blur-2xl"
          />
        </svg>

        {/* ── LORE PANEL (right) ──────────────────────────────── */}
        <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[420px] z-20">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="glass-panel p-10 rounded-2xl relative overflow-hidden"
          >
            {/* Accent top bar using planet glow */}
            <div
              className="absolute top-0 left-0 w-full h-[2px]"
              style={{ background: `linear-gradient(to right, ${planet.glow}, transparent)` }}
            />

            {/* Layer badge */}
            <div
              className="text-[10px] tracking-[0.3em] mb-2"
              style={{ color: planet.glow }}
            >
              {planet.lore.subtitle}
            </div>

            {/* Planet name */}
            <h1
              className="text-5xl font-light tracking-wider text-white mb-6"
              style={{ textShadow: `0 0 20px ${planet.glow}80` }}
            >
              {planet.name}
            </h1>

            {/* Lore paragraphs */}
            <div className="space-y-4 text-sm text-white/70 leading-relaxed font-light">
              {planet.lore.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Stats grid */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              {planet.lore.stats.map((stat, i) => (
                <div key={stat.label}>
                  <div className="text-[9px] tracking-[0.2em] text-white/40 mb-1">
                    {stat.label}
                  </div>
                  <div
                    className={`text-lg ${stat.color ?? 'text-white'}`}
                    style={i < 2 ? { fontVariantNumeric: 'tabular-nums' } : undefined}
                  >
                    {i === 0
                      ? planet.lore.stats[0].value.replace(/[\d.]+/, formatStat(planet.lore.stats[0].value, count0))
                      : i === 1
                      ? planet.lore.stats[1].value.replace(/[\d.]+/, formatStat(planet.lore.stats[1].value, count1))
                      : stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {onDescend && (
              <motion.button
                onClick={handleDescend}
                disabled={descending}
                whileTap={{ scale: 0.96 }}
                className="mt-8 w-full py-3 border text-xs tracking-[0.2em] transition-colors rounded"
                style={{
                  borderColor: `${planet.glow}50`,
                  color: planet.glow,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${planet.glow}1A`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                }}
              >
                {descending ? 'DESCENDING...' : planet.lore.cta}
              </motion.button>
            )}

            {/* Close link */}
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 text-[10px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
            >
              RETURN TO OVERVIEW
            </button>
          </motion.div>
        </div>

        {/* Layer label — top right */}
        <div className="absolute top-6 left-[480px] text-right z-30">
          <div className="text-[10px] tracking-[0.3em] text-white/40 mb-1">
            LAYER {planet.layer}
          </div>
          <div
            className="text-sm tracking-[0.2em] font-medium"
            style={{ color: planet.glow, textShadow: `0 0 10px ${planet.glow}80` }}
          >
            {planet.name}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
