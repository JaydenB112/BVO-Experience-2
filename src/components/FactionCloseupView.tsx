import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Faction } from '../data/factions'

interface FactionCloseupViewProps {
  faction: Faction
  onClose: () => void
}

// ── Faction emblems — each is a unique SVG symbol ─────────────────────────────

function MeridianEmblem({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* Outer frame */}
      <motion.rect
        x="10" y="10" width="100" height="100" rx="4"
        fill="none" stroke={color} strokeWidth="1"
        opacity={0.2}
        animate={{ opacity: [0.15, 0.30, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Top lintel */}
      <rect x="18" y="22" width="84" height="7" rx="2" fill={color} opacity={0.9} />
      {/* Three pillars */}
      <rect x="22" y="29" width="18" height="58" rx="2" fill={color} opacity={0.85} />
      <rect x="51" y="29" width="18" height="58" rx="2" fill={color} opacity={0.85} />
      <rect x="80" y="29" width="18" height="58" rx="2" fill={color} opacity={0.85} />
      {/* Base */}
      <rect x="18" y="87" width="84" height="7" rx="2" fill={color} opacity={0.9} />
      {/* Descending light beam between center pillar */}
      <motion.rect
        x="57" y="29" width="6" height="58" rx="1"
        fill="white"
        animate={{ opacity: [0, 0.35, 0], scaleY: [0.2, 1, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ transformOrigin: '60px 29px' }}
      />
    </svg>
  )
}

function TidebloodsEmblem({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* Outer glow ring */}
      <motion.circle
        cx="60" cy="60" r="50"
        fill="none" stroke={color} strokeWidth="0.8"
        animate={{ opacity: [0.10, 0.22, 0.10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* River wave — upper */}
      <motion.path
        d="M 10 52 C 22 32, 38 72, 60 52 C 82 32, 98 68, 110 52"
        fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        animate={{ d: [
          'M 10 52 C 22 32, 38 72, 60 52 C 82 32, 98 68, 110 52',
          'M 10 52 C 22 68, 38 36, 60 52 C 82 68, 98 40, 110 52',
          'M 10 52 C 22 32, 38 72, 60 52 C 82 32, 98 68, 110 52',
        ]}}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* River wave — lower */}
      <motion.path
        d="M 10 68 C 22 48, 38 88, 60 68 C 82 48, 98 84, 110 68"
        fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"
        opacity={0.45}
        animate={{ d: [
          'M 10 68 C 22 48, 38 88, 60 68 C 82 48, 98 84, 110 68',
          'M 10 68 C 22 84, 38 52, 60 68 C 82 84, 98 56, 110 68',
          'M 10 68 C 22 48, 38 88, 60 68 C 82 48, 98 84, 110 68',
        ]}}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      {/* Third eye — River sight */}
      <motion.circle
        cx="60" cy="52" r="10"
        fill="none" stroke={color} strokeWidth="1.8"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 52px' }}
      />
      <motion.circle
        cx="60" cy="52" r="4"
        fill={color}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Iris lines */}
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <line
          key={deg}
          x1={60 + Math.cos((deg * Math.PI) / 180) * 5}
          y1={52 + Math.sin((deg * Math.PI) / 180) * 5}
          x2={60 + Math.cos((deg * Math.PI) / 180) * 9}
          y2={52 + Math.sin((deg * Math.PI) / 180) * 9}
          stroke={color} strokeWidth="1" opacity={0.6}
        />
      ))}
    </svg>
  )
}

function DriftEmblem({ color }: { color: string }) {
  // Broken orbital ring with scattered fragments
  const fragments = [
    { cx: 14, cy: 18, r: 3, op: 0.7 },
    { cx: 102, cy: 22, r: 2, op: 0.5 },
    { cx: 10, cy: 88, r: 2.5, op: 0.6 },
    { cx: 108, cy: 94, r: 1.8, op: 0.4 },
    { cx: 60, cy: 8, r: 1.5, op: 0.5 },
    { cx: 16, cy: 54, r: 1.5, op: 0.4 },
    { cx: 104, cy: 60, r: 2, op: 0.5 },
  ]
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* Main broken orbital ring */}
      <motion.circle
        cx="60" cy="60" r="42"
        fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray="16 6"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '60px 60px' }}
      />
      {/* Inner ghost ring */}
      <circle cx="60" cy="60" r="28"
        fill="none" stroke={color} strokeWidth="1"
        strokeDasharray="6 10" opacity={0.3}
      />
      {/* Scattered world fragments — slowly drifting */}
      {fragments.map((f, i) => (
        <motion.circle
          key={i}
          cx={f.cx} cy={f.cy} r={f.r}
          fill={color} opacity={f.op}
          animate={{
            cx: [f.cx, f.cx + (i % 2 === 0 ? -4 : 4), f.cx],
            cy: [f.cy, f.cy + (i % 3 === 0 ? -3 : 3), f.cy],
          }}
          transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
      {/* Center void */}
      <circle cx="60" cy="60" r="10" fill="none" stroke={color} strokeWidth="1.2" opacity={0.4} />
      <motion.circle
        cx="60" cy="60" r="3"
        fill={color} opacity={0.6}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function StarGuildEmblem({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {/* Outer precision ring */}
      <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="1" opacity={0.4} />
      {/* Tick marks on outer ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
        const r1 = 46, r2 = 50
        const rad = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={60 + Math.cos(rad) * r1} y1={60 + Math.sin(rad) * r1}
            x2={60 + Math.cos(rad) * r2} y2={60 + Math.sin(rad) * r2}
            stroke={color} strokeWidth={deg % 90 === 0 ? 2 : 1} opacity={0.7}
          />
        )
      })}
      {/* Rotating reticle ring */}
      <motion.circle
        cx="60" cy="60" r="36"
        fill="none" stroke={color} strokeWidth="1.2"
        strokeDasharray="5 8"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '60px 60px' }}
      />
      {/* Cross lines with gaps */}
      <line x1="60" y1="10" x2="60" y2="44" stroke={color} strokeWidth="1.5" opacity={0.8} />
      <line x1="60" y1="76" x2="60" y2="110" stroke={color} strokeWidth="1.5" opacity={0.8} />
      <line x1="10" y1="60" x2="44" y2="60" stroke={color} strokeWidth="1.5" opacity={0.8} />
      <line x1="76" y1="60" x2="110" y2="60" stroke={color} strokeWidth="1.5" opacity={0.8} />
      {/* Inner target ring */}
      <circle cx="60" cy="60" r="16" fill="none" stroke={color} strokeWidth="1.8" opacity={0.9} />
      {/* Center star */}
      <motion.circle
        cx="60" cy="60" r="5"
        fill={color}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 60px' }}
      />
      {/* Corner bracket marks */}
      {[[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sy], i) => (
        <path
          key={i}
          d={`M ${60+sx*22} ${60+sy*14} L ${60+sx*22} ${60+sy*22} L ${60+sx*14} ${60+sy*22}`}
          fill="none" stroke={color} strokeWidth="1.5" opacity={0.6}
        />
      ))}
    </svg>
  )
}

function FactionEmblem({ faction }: { faction: Faction }) {
  const props = { color: faction.color }
  switch (faction.id) {
    case 'meridian':    return <MeridianEmblem {...props} />
    case 'tidebloods':  return <TidebloodsEmblem {...props} />
    case 'drift':       return <DriftEmblem {...props} />
    case 'starguild':   return <StarGuildEmblem {...props} />
    default:            return null
  }
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function FactionCloseupView({ faction, onClose }: FactionCloseupViewProps) {
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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-[200] bg-space overflow-hidden flex items-center justify-center"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close faction view"
        className="absolute top-6 right-6 z-50 w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-300 text-xl rounded-full hover:bg-white/10"
      >
        ✕
      </button>

      <div className="relative w-[1440px] h-[900px] max-w-full max-h-full shrink-0 flex items-center">

        {/* ── EMBLEM (left) ─────────────────────────────────────── */}
        <div className="absolute -left-[80px] md:-left-[140px] top-1/2 -translate-y-1/2 w-[700px] md:w-[860px] h-[700px] md:h-[860px] pointer-events-none">
          {/* Atmospheric glow */}
          <motion.div
            className="absolute inset-[15%] rounded-full blur-[100px]"
            style={{ background: `${faction.color}18` }}
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-[30%] rounded-full blur-[60px]"
            style={{ background: `${faction.color}22` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Emblem */}
          <motion.div
            className="absolute inset-[18%]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 24px ${faction.color}60)` }}
          >
            <FactionEmblem faction={faction} />
          </motion.div>
        </div>

        {/* ── LORE PANEL (right) ────────────────────────────────── */}
        <div className="absolute right-[4%] md:right-[6%] top-1/2 -translate-y-1/2 w-[90%] max-w-[440px] z-20">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
            className="glass-panel p-6 md:p-10 rounded-2xl relative overflow-hidden max-h-[90dvh] overflow-y-auto"
          >
            {/* Faction-coloured accent bar */}
            <div
              className="absolute top-0 left-0 w-full h-[2px]"
              style={{ background: `linear-gradient(to right, ${faction.color}, transparent)` }}
            />

            {/* Stance badge */}
            <div
              className="inline-block text-[9px] tracking-[0.3em] border px-2.5 py-1 rounded mb-4"
              style={{ color: faction.color, borderColor: `${faction.color}40` }}
            >
              {faction.stance}
            </div>

            {/* Name */}
            <h1
              className="text-4xl md:text-5xl font-light tracking-wider text-white mb-1"
              style={{ textShadow: `0 0 24px ${faction.color}60` }}
            >
              {faction.name}
            </h1>
            <p
              className="text-[10px] tracking-[0.25em] mb-6"
              style={{ color: faction.color, opacity: 0.7 }}
            >
              {faction.lore.subtitle}
            </p>

            {/* Lore */}
            <div className="space-y-4 text-sm text-white/65 leading-relaxed font-light mb-8">
              {faction.lore.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Stats */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              {faction.lore.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-[9px] tracking-[0.2em] text-white/35 mb-1">{stat.label}</div>
                  <div className="text-base font-light text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="mt-8 w-full py-2 text-[10px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
            >
              RETURN TO OVERVIEW
            </button>
          </motion.div>
        </div>

        {/* Top label */}
        <div className="absolute top-6 left-[300px] md:left-[480px] z-30">
          <div className="text-[10px] tracking-[0.3em] text-white/35 mb-1">FACTION</div>
          <div
            className="text-sm tracking-[0.2em] font-medium"
            style={{ color: faction.color, textShadow: `0 0 10px ${faction.color}80` }}
          >
            {faction.name}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
