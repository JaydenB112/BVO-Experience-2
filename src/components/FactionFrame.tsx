/**
 * FactionFrame — full-screen ambient faction page.
 * Used by MeridianFrame (faction: meridian) and Layer2Frame (faction: tidebloods).
 * Shows the animated emblem, lore, and stats in an immersive layout.
 */
import { motion } from 'framer-motion'
import { getFactionById } from '../data/factions'
import type { Faction } from '../data/factions'

// ── Animated emblems (large, full-frame versions) ─────────────────────────────

function MeridianEmblem({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <motion.rect x="16" y="16" width="168" height="168" rx="4"
        fill="none" stroke={color} strokeWidth="0.8" opacity={0.12}
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Lintel */}
      <rect x="30" y="38" width="140" height="11" rx="3" fill={color} opacity={0.9}/>
      {/* Three pillars */}
      <rect x="36"  y="49" width="30" height="96" rx="3" fill={color} opacity={0.85}/>
      <rect x="85"  y="49" width="30" height="96" rx="3" fill={color} opacity={0.85}/>
      <rect x="134" y="49" width="30" height="96" rx="3" fill={color} opacity={0.85}/>
      {/* Base */}
      <rect x="30" y="145" width="140" height="11" rx="3" fill={color} opacity={0.9}/>
      {/* Descending light */}
      <motion.rect x="96" y="49" width="8" height="96" rx="2" fill="white"
        animate={{ opacity: [0, 0.4, 0], scaleY: [0.1, 1, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ transformOrigin: '100px 49px' }}
      />
    </svg>
  )
}

function TidebloodsEmblem({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <motion.circle cx="100" cy="100" r="88" fill="none" stroke={color} strokeWidth="0.6"
        animate={{ opacity: [0.08, 0.20, 0.08] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Upper wave */}
      <motion.path
        d="M 16 90 C 36 50, 66 130, 100 90 C 134 50, 164 118, 184 90"
        fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        animate={{ d: [
          'M 16 90 C 36 50, 66 130, 100 90 C 134 50, 164 118, 184 90',
          'M 16 90 C 36 118, 66 54, 100 90 C 134 118, 164 62, 184 90',
          'M 16 90 C 36 50, 66 130, 100 90 C 134 50, 164 118, 184 90',
        ]}}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Lower wave */}
      <motion.path
        d="M 16 116 C 36 78, 66 154, 100 116 C 134 78, 164 142, 184 116"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.4}
        animate={{ d: [
          'M 16 116 C 36 78,  66 154, 100 116 C 134 78,  164 142, 184 116',
          'M 16 116 C 36 142, 66 82,  100 116 C 134 142, 164 90,  184 116',
          'M 16 116 C 36 78,  66 154, 100 116 C 134 78,  164 142, 184 116',
        ]}}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      {/* Third eye */}
      <motion.circle cx="100" cy="90" r="18" fill="none" stroke={color} strokeWidth="2.5"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '100px 90px' }}
      />
      <motion.circle cx="100" cy="90" r="7" fill={color}
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <line key={deg}
          x1={100 + Math.cos(deg * Math.PI / 180) * 9}
          y1={90  + Math.sin(deg * Math.PI / 180) * 9}
          x2={100 + Math.cos(deg * Math.PI / 180) * 16}
          y2={90  + Math.sin(deg * Math.PI / 180) * 16}
          stroke={color} strokeWidth="1.5" opacity={0.6}
        />
      ))}
    </svg>
  )
}

function emblemFor(faction: Faction) {
  if (faction.id === 'meridian')   return <MeridianEmblem   color={faction.color}/>
  if (faction.id === 'tidebloods') return <TidebloodsEmblem color={faction.color}/>
  return null
}

// ── FactionFrame ──────────────────────────────────────────────────────────────

interface FactionFrameProps {
  factionId: string
}

export function FactionFrame({ factionId }: FactionFrameProps) {
  const faction = getFactionById(factionId)
  if (!faction) return null

  return (
    <motion.div
      key={factionId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 30% 50%, ${faction.color}0D 0%, transparent 70%)`,
        }}
      />

      {/* Scanline texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)',
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-12 md:gap-20">

        {/* ── Emblem ────────────────────────────────────── */}
        <motion.div
          className="shrink-0 w-[240px] h-[240px] md:w-[360px] md:h-[360px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 40px ${faction.color}40)` }}
        >
          {emblemFor(faction)}
        </motion.div>

        {/* ── Lore panel ────────────────────────────────── */}
        <motion.div
          className="flex-1 max-w-xl"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          {/* Stance badge */}
          <div
            className="inline-block text-[9px] tracking-[0.3em] border px-3 py-1 rounded mb-5"
            style={{ color: faction.color, borderColor: `${faction.color}50` }}
          >
            {faction.stance}
          </div>

          {/* Subtitle */}
          <div className="text-[10px] tracking-[0.3em] text-white/30 mb-2">
            {faction.lore.subtitle}
          </div>

          {/* Name */}
          <h1
            className="text-5xl md:text-6xl font-light tracking-wider text-white mb-6"
            style={{ textShadow: `0 0 30px ${faction.color}50` }}
          >
            {faction.name}
          </h1>

          {/* Divider */}
          <div className="w-16 h-[1px] mb-6" style={{ background: faction.color, opacity: 0.4 }}/>

          {/* Lore */}
          <div className="space-y-4 text-sm text-white/65 leading-relaxed font-light mb-8">
            {faction.lore.description.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {faction.lore.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.5 }}
                className="border border-white/10 rounded-lg px-4 py-3 bg-white/[0.03]"
              >
                <div className="text-[8px] tracking-[0.22em] text-white/30 mb-1">{stat.label}</div>
                <div className="text-sm font-light text-white">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-8 right-8 text-right hidden md:block" aria-hidden="true">
        <div className="text-[8px] tracking-[0.3em] text-white/15 mb-1">FACTION DOSSIER</div>
        <div className="text-[8px] tracking-[0.3em]" style={{ color: faction.color, opacity: 0.4 }}>
          {faction.id.toUpperCase()}-{String(Date.now()).slice(-4)}
        </div>
      </div>
    </motion.div>
  )
}
