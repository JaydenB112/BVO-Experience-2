import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALL_FACTIONS } from '../data/factions'
import type { Faction } from '../data/factions'

interface FrameSwitcherProps {
  currentFrame: number
  setFrame: (index: number) => void
  onFactionClick: (faction: Faction) => void
}

// Which frame index each faction navigates to (null = info only)
const FACTION_FRAME: Record<string, number | null> = {
  meridian:   1,
  tidebloods: 2,
  drift:      null,
  starguild:  null,
}

// ── Mini SVG emblems ──────────────────────────────────────────────────────────
function MiniEmblem({ id, color, size = 18 }: { id: string; color: string; size?: number }) {
  switch (id) {
    case 'meridian':
      return (
        <svg viewBox="0 0 20 20" width={size} height={size}>
          <rect x="2" y="2"  width="16" height="2.5" rx="0.5" fill={color} opacity={0.9}/>
          <rect x="3" y="5"  width="4"  height="11"  rx="0.5" fill={color} opacity={0.8}/>
          <rect x="8" y="5"  width="4"  height="11"  rx="0.5" fill={color} opacity={0.8}/>
          <rect x="13" y="5" width="4"  height="11"  rx="0.5" fill={color} opacity={0.8}/>
          <rect x="2" y="15.5" width="16" height="2.5" rx="0.5" fill={color} opacity={0.9}/>
        </svg>
      )
    case 'tidebloods':
      return (
        <svg viewBox="0 0 20 20" width={size} height={size}>
          <path d="M1 13 C4 7,8 16,10 11 C12 6,16 14,19 11"
            fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="2.5" fill="none" stroke={color} strokeWidth="1.2"/>
          <circle cx="10" cy="10" r="1" fill={color}/>
        </svg>
      )
    case 'drift':
      return (
        <svg viewBox="0 0 20 20" width={size} height={size}>
          <circle cx="10" cy="10" r="7" fill="none" stroke={color} strokeWidth="1.5"
            strokeDasharray="3.5 2.5"/>
          <circle cx="3"  cy="4"  r="1.2" fill={color} opacity={0.7}/>
          <circle cx="17" cy="5"  r="0.9" fill={color} opacity={0.5}/>
          <circle cx="4"  cy="16" r="1"   fill={color} opacity={0.6}/>
          <circle cx="16" cy="16" r="0.8" fill={color} opacity={0.4}/>
        </svg>
      )
    case 'starguild':
      return (
        <svg viewBox="0 0 20 20" width={size} height={size}>
          <circle cx="10" cy="10" r="7"   fill="none" stroke={color} strokeWidth="1"   opacity={0.5}/>
          <circle cx="10" cy="10" r="2.5" fill="none" stroke={color} strokeWidth="1.2"/>
          <line x1="10" y1="3"    x2="10" y2="7.5"  stroke={color} strokeWidth="1.2"/>
          <line x1="10" y1="12.5" x2="10" y2="17"   stroke={color} strokeWidth="1.2"/>
          <line x1="3"  y1="10"   x2="7.5"  y2="10" stroke={color} strokeWidth="1.2"/>
          <line x1="12.5" y1="10" x2="17"  y2="10"  stroke={color} strokeWidth="1.2"/>
        </svg>
      )
    default: return null
  }
}

// ── Faction info panel (anchored below each button) ───────────────────────────
interface FactionPanelProps {
  faction: Faction
  onExplore: () => void
  onClose: () => void
}

function FactionPanel({ faction, onExplore, onClose }: FactionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="glass-panel rounded-2xl overflow-hidden w-[min(90vw,360px)]"
    >
      {/* Faction colour accent */}
      <div className="h-[2px]" style={{ background: `linear-gradient(to right, ${faction.color}, transparent)` }}/>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${faction.color}15`, border: `1px solid ${faction.color}30` }}
          >
            <MiniEmblem id={faction.id} color={faction.color} size={24}/>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-[10px] tracking-[0.25em] font-semibold"
                style={{ color: faction.color }}
              >
                {faction.name}
              </h3>
              <span
                className="text-[7px] tracking-[0.15em] border px-1.5 py-0.5 rounded"
                style={{ color: faction.color, borderColor: `${faction.color}40` }}
              >
                {faction.stance}
              </span>
            </div>
            <p className="text-[9px] text-white/35 mt-0.5">{faction.tagline}</p>
          </div>
        </div>

        {/* Lore — first paragraph only */}
        <p className="text-[11px] text-white/60 leading-relaxed mb-4">
          {faction.lore.description[0]}
        </p>

        {/* Stats — 2×2 grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {faction.lore.stats.map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-lg px-3 py-2">
              <div className="text-[7px] tracking-[0.2em] text-white/30 mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-white font-light">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExplore}
            className="flex-1 py-2 text-[9px] tracking-[0.2em] rounded-lg transition-colors duration-200 font-medium"
            style={{
              background: `${faction.color}20`,
              color: faction.color,
              border: `1px solid ${faction.color}40`,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${faction.color}30`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${faction.color}20`)}
          >
            FULL PROFILE →
          </button>
          <button
            onClick={onClose}
            className="py-2 px-3 text-[9px] tracking-[0.15em] text-white/30 hover:text-white/60 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function FrameSwitcher({ currentFrame, setFrame, onFactionClick }: FrameSwitcherProps) {
  const swipeStartX = useRef<number | null>(null)
  const [openFactionId, setOpenFactionId] = useState<string | null>(null)

  // Measure each faction button's position for panel anchoring
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const navRef = useRef<HTMLDivElement>(null)

  const openFaction = ALL_FACTIONS.find(f => f.id === openFactionId) ?? null

  const handleFactionBtn = useCallback((faction: Faction) => {
    // Toggle panel
    setOpenFactionId(prev => (prev === faction.id ? null : faction.id))
    // Navigate if this faction has a frame
    const frameIdx = FACTION_FRAME[faction.id]
    if (frameIdx !== null) setFrame(frameIdx)
  }, [setFrame])

  const handlePointerDown = (e: React.PointerEvent) => { swipeStartX.current = e.clientX }
  const handlePointerUp   = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return
    const delta = swipeStartX.current - e.clientX
    if (delta >  60 && currentFrame < 2) setFrame(currentFrame + 1)
    if (delta < -60 && currentFrame > 0) setFrame(currentFrame - 1)
    swipeStartX.current = null
  }

  // Work out horizontal offset so panel aligns with its button
  const getPanelOffset = (): number => {
    if (!openFactionId || !btnRefs.current[openFactionId] || !navRef.current) return 0
    const btn  = btnRefs.current[openFactionId]!.getBoundingClientRect()
    const nav  = navRef.current.getBoundingClientRect()
    const btnCenter = btn.left + btn.width / 2
    const navCenter = nav.left + nav.width / 2
    return btnCenter - navCenter
  }

  return (
    <div
      ref={navRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* ── Faction info panel — anchored above clicked button ── */}
      <AnimatePresence mode="wait">
        {openFaction && (
          <div
            key={openFaction.id}
            className="relative mb-1"
            style={{
              transform: `translateX(${Math.max(
                // Clamp so panel never overflows viewport edge
                Math.min(getPanelOffset(), 120),
                -120
              )}px)`,
            }}
          >
            <FactionPanel
              faction={openFaction}
              onExplore={() => { onFactionClick(openFaction); setOpenFactionId(null) }}
              onClose={() => setOpenFactionId(null)}
            />
            {/* Caret pointing down to nav */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Progress bar ── */}
      <div className="w-[300px] h-[1px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-white/40"
          animate={{ width: `${(currentFrame / 2) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Nav pill ── */}
      <div className="glass-panel px-3 py-2.5 rounded-full flex items-center gap-1">

        {/* Galaxy View — frame 0 */}
        <button
          onClick={() => { setFrame(0); setOpenFactionId(null) }}
          aria-label="Galaxy View"
          aria-current={currentFrame === 0 && !openFactionId ? 'page' : undefined}
          className={`relative px-3 py-1 rounded-full text-[8px] tracking-[0.2em] font-semibold transition-all duration-300 ${
            currentFrame === 0 && !openFactionId
              ? 'text-layer1 bg-layer1/10'
              : 'text-white/35 hover:text-white/60'
          }`}
        >
          GALAXY VIEW
          {currentFrame === 0 && !openFactionId && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-layer1"
            />
          )}
        </button>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-white/10 mx-1 shrink-0"/>

        {/* 4 faction buttons */}
        {ALL_FACTIONS.map(faction => {
          const isActive = openFactionId === faction.id
          const frameIdx = FACTION_FRAME[faction.id]
          const isCurrentFrame = frameIdx !== null && currentFrame === frameIdx

          return (
            <button
              key={faction.id}
              ref={el => { btnRefs.current[faction.id] = el }}
              onClick={() => handleFactionBtn(faction)}
              aria-label={`View ${faction.name}`}
              aria-expanded={isActive}
              className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] tracking-[0.2em] font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-white/8 text-white/90'
                  : isCurrentFrame
                  ? 'text-white/70 hover:text-white/90'
                  : 'text-white/30 hover:text-white/60'
              }`}
              style={isActive ? { color: faction.color } : undefined}
            >
              <MiniEmblem id={faction.id} color={isActive ? faction.color : 'currentColor'} size={12}/>
              <span>{faction.name.replace('THE ', '')}</span>
              {(isActive || isCurrentFrame) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: faction.color }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
