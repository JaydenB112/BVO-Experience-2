import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface TheKeyCloseupViewProps {
  onClose: () => void
}

const FACTIONS = [
  {
    name: 'THE MERIDIAN',
    color: '#FFFFFF',
    stance: 'DOMINION',
    desc: 'The iron authority of the layers. The Meridian does not want The Key opened — they want it under their seal, controlled, legitimised. In their hands it becomes the final argument: obey, or be locked out of reality itself.',
  },
  {
    name: 'THE TIDEBLOODS',
    color: '#2ECFCF',
    stance: 'COMMUNION',
    desc: 'Born with a sensitivity to The River\'s current, the Tidebloods believe The Key is not a weapon or a door — it is a living threshold. They seek to listen to it, not use it. The Meridian has hunted them for generations for refusing to hand over what they know.',
  },
  {
    name: 'THE DRIFT',
    color: '#F5C842',
    stance: 'LIBERATION',
    desc: 'The free worlds — scattered, unmoored, and furious. The Drift doesn\'t care about The Key\'s spiritual power. They want it opened because The Meridian fears that most. Whatever breaks the empire\'s grip is worth fighting for.',
  },
  {
    name: 'THE STAR GUILD',
    color: '#9B3FDE',
    stance: 'ACQUISITION',
    desc: 'No ideology. No cause. The Star Guild operates on open contracts — and every faction has hired them at least once. They move freely through all three layers precisely because they answer to none of them. Whoever pays most when the moment comes gets the key.',
  },
]

export function TheKeyCloseupView({ onClose }: TheKeyCloseupViewProps) {
  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed inset-0 z-[200] bg-space overflow-hidden flex items-center justify-center"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close The Key view"
        className="absolute top-6 right-6 z-50 w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-300 text-xl leading-none rounded-full hover:bg-white/10"
      >
        ✕
      </button>

      <div className="relative w-[1440px] h-[900px] max-w-full max-h-full shrink-0 flex items-center">

        {/* ── THE KEY SINGULARITY (left) ────────────────────────────────── */}
        <div className="absolute -left-[120px] md:-left-[200px] top-1/2 -translate-y-1/2 w-[800px] md:w-[1000px] h-[800px] md:h-[1000px] pointer-events-none">

          {/* Deep void wash */}
          <div
            className="absolute inset-0 rounded-full blur-[160px] opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(100,40,200,0.4) 0%, rgba(255,20,20,0.15) 40%, transparent 70%)' }}
          />

          {/* Outer corona ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[10%] rounded-full"
            style={{ transformOrigin: 'center' }}
          >
            <svg className="w-full h-full" viewBox="0 0 800 800">
              <ellipse
                cx="400" cy="400" rx="390" ry="110"
                fill="none" stroke="rgba(245,200,66,0.18)" strokeWidth="1.5"
                strokeDasharray="8 24"
              />
            </svg>
          </motion.div>

          {/* Mid orbital ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[20%] rounded-full"
            style={{ transformOrigin: 'center' }}
          >
            <svg className="w-full h-full" viewBox="0 0 640 640">
              <ellipse
                cx="320" cy="320" rx="315" ry="90"
                fill="none" stroke="rgba(130,60,255,0.30)" strokeWidth="1.2"
                strokeDasharray="4 14"
              />
            </svg>
          </motion.div>

          {/* Inner ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[32%] rounded-full"
            style={{ transformOrigin: 'center' }}
          >
            <svg className="w-full h-full" viewBox="0 0 480 480">
              <ellipse
                cx="240" cy="240" rx="235" ry="68"
                fill="none" stroke="rgba(255,50,50,0.40)" strokeWidth="1"
                strokeDasharray="2 8"
              />
            </svg>
          </motion.div>

          {/* Pulsing halo layers */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.60, 0.35] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[35%] rounded-full blur-[60px]"
            style={{ background: 'radial-gradient(circle, rgba(200,130,255,0.7) 0%, rgba(100,40,200,0.3) 50%, transparent 70%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.50, 0.80, 0.50] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute inset-[42%] rounded-full blur-[30px]"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(220,130,255,0.5) 40%, transparent 70%)' }}
          />

          {/* Rotating spoke rays */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[40%]"
            style={{ transformOrigin: 'center' }}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="100" y1="100"
                  x2={100 + Math.cos((deg * Math.PI) / 180) * 95}
                  y2={100 + Math.sin((deg * Math.PI) / 180) * 95}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="0.8"
                />
              ))}
            </svg>
          </motion.div>

          {/* Core pinpoint */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[48%] rounded-full blur-[6px]"
            style={{ background: 'white' }}
          />
          <div
            className="absolute inset-[49.5%] rounded-full"
            style={{ background: 'white' }}
          />

          {/* Lens cross */}
          <svg className="absolute inset-[44%] w-[12%] h-[12%] overflow-visible" viewBox="0 0 40 40">
            <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="0.5" opacity="0.5" />
            <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>

        {/* ── LORE PANEL (right) ──────────────────────────────────────────── */}
        <div className="absolute right-[4%] md:right-[6%] top-1/2 -translate-y-1/2 w-[90%] max-w-[440px] z-20">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="glass-panel p-6 md:p-10 rounded-2xl relative overflow-hidden max-h-[90dvh] overflow-y-auto"
          >
            {/* Accent bar — tri-colour representing all three factions */}
            <div
              className="absolute top-0 left-0 w-full h-[2px]"
              style={{ background: 'linear-gradient(to right, #F5C842, #6B3CDC, #FF2020)' }}
            />

            {/* Badge */}
            <div className="text-[10px] tracking-[0.3em] mb-2 text-white/40">
              THE CONVERGENCE POINT
            </div>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl font-light tracking-wider text-white mb-2"
              style={{ textShadow: '0 0 30px rgba(200,130,255,0.6)' }}
            >
              THE KEY
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-white/30 mb-6 uppercase">
              Layer Terminus · The River Singularity
            </p>

            {/* Core lore */}
            <div className="space-y-4 text-sm text-white/70 leading-relaxed font-light mb-8">
              <p>
                At the deepest point of The River, where all three orbital layers collapse into a single convergence, sits The Key. It is not a place. It is not a object. It is the threshold itself — the lock and the mechanism of reality's underlying structure.
              </p>
              <p>
                Those who have reached it describe the same thing: a door with no frame, standing in nothing, radiating the certainty that whatever lies beyond it is the answer to every question that has ever been asked in the Familiar Skies.
              </p>
              <p>
                No one has opened it. Every faction believes they should be the one to try.
              </p>
            </div>

            {/* Factions */}
            <div className="border-t border-white/10 pt-6 space-y-5">
              <div className="text-[9px] tracking-[0.3em] text-white/30 mb-4">FACTIONS IN CONFLICT</div>
              {FACTIONS.map((faction) => (
                <div key={faction.name} className="flex gap-3">
                  {/* Faction colour marker */}
                  <div
                    className="mt-1 w-[2px] shrink-0 h-auto rounded-full"
                    style={{ background: faction.color, boxShadow: `0 0 8px ${faction.color}80` }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] tracking-[0.25em] font-medium"
                        style={{ color: faction.color }}
                      >
                        {faction.name}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] text-white/20 border border-white/10 px-1.5 py-0.5 rounded">
                        {faction.stance}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed font-light">
                      {faction.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Return */}
            <button
              onClick={onClose}
              className="mt-8 w-full py-2 text-[10px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
            >
              RETURN TO OVERVIEW
            </button>
          </motion.div>
        </div>

        {/* Layer label top-left */}
        <div className="absolute top-6 left-[300px] md:left-[480px] z-30">
          <div className="text-[10px] tracking-[0.3em] text-white/40 mb-1">CONVERGENCE</div>
          <div
            className="text-sm tracking-[0.2em] font-medium"
            style={{ color: '#DC82FF', textShadow: '0 0 10px rgba(200,130,255,0.8)' }}
          >
            THE KEY
          </div>
        </div>
      </div>
    </motion.div>
  )
}
