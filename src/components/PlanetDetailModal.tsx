import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Planet } from '../types'

interface PlanetDetailModalProps {
  planet: Planet | null
  onClose: () => void
  onDescend?: () => void
}

export function PlanetDetailModal({ planet, onClose, onDescend }: PlanetDetailModalProps) {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!planet) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="planet-modal-title"
        className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 40 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative max-w-lg w-full mx-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden pointer-events-auto max-h-[90dvh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent gradient bar */}
          <div
            className="h-[2px] w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${planet.glow}, transparent)` }}
            aria-hidden="true"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white active:text-white transition-colors duration-200 z-10 text-xl leading-none rounded-full hover:bg-white/10"
          >
            ✕
          </button>

          <div className="p-5 md:p-8">
            {/* Planet orb preview */}
            <div className="flex justify-center mb-4 md:mb-6">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <div
                  className="rounded-full relative"
                  style={{
                    width: 64,
                    height: 64,
                    background: `radial-gradient(circle at 30% 30%, ${planet.color1}, ${planet.color2}, #000)`,
                    boxShadow: `inset -4px -4px 10px rgba(0,0,0,0.8), 0 0 40px ${planet.glow}60, 0 0 80px ${planet.glow}20`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full opacity-50 mix-blend-screen"
                    style={{ boxShadow: `inset 0 0 30px ${planet.glow}` }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Planet name */}
            <h2
              id="planet-modal-title"
              className="text-3xl md:text-4xl font-light tracking-wider text-center text-white mb-1"
            >
              {planet.name}
            </h2>

            {/* Subtitle tag */}
            <p
              className="text-[10px] tracking-[0.3em] text-center mb-6 font-medium"
              style={{ color: planet.glow }}
            >
              {planet.lore.subtitle}
            </p>

            {/* Lore paragraphs */}
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {planet.lore.description.map((para, i) => (
                <p key={i} className="text-xs md:text-sm text-white/70 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
              {planet.lore.stats.map((stat, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-lg p-2 md:p-3"
                >
                  <div className="text-[8px] md:text-[9px] tracking-[0.2em] text-white/40 mb-1 uppercase">
                    {stat.label}
                  </div>
                  <div className={`text-xs md:text-sm font-medium ${stat.color ?? 'text-white'}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => {
                if (onDescend) onDescend()
                else onClose()
              }}
              className="w-full py-3 rounded-xl text-xs tracking-[0.25em] font-medium transition-all duration-300 border"
              style={{
                borderColor: `${planet.glow}60`,
                color: planet.glow,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = `${planet.glow}20`
                el.style.boxShadow = `0 0 20px ${planet.glow}30`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = 'transparent'
                el.style.boxShadow = 'none'
              }}
            >
              {planet.lore.cta}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
