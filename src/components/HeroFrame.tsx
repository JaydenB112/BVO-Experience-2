import React, { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ALL_PLANETS } from '../data/planets'
import type { Planet } from '../types'

// SVG scene dimensions (must match viewBox)
const SVG_W = 1440
const SVG_H = 900

// ─── Planet Orb sub-component ────────────────────────────────────────────────
function PlanetOrb({
  planet,
  onClick,
}: {
  planet: Planet
  onClick: () => void
}) {
  return (
    // Outer wrapper provides a minimum 44×44 pt tap target without shifting layout
    <div
      style={{
        position: 'absolute',
        left: planet.x - Math.max(0, (44 - planet.size) / 2),
        top: planet.y - Math.max(0, (44 - planet.size) / 2),
        padding: Math.max(0, (44 - planet.size) / 2),
      }}
    >
      <motion.div
        className="flex flex-col items-center group cursor-pointer z-20"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6 + planet.delay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: planet.delay,
        }}
        onClick={onClick}
        data-planet={planet.id}
        role="button"
        aria-label={`Explore ${planet.name}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <div
          className={`rounded-full relative ${planet.border ?? ''}`}
          style={{
            width: planet.size,
            height: planet.size,
            background: `radial-gradient(circle at 30% 30%, ${planet.color1}, ${planet.color2}, #000)`,
            boxShadow: `inset -4px -4px 10px rgba(0,0,0,0.8), 0 0 ${planet.size}px ${planet.glow}40`,
            transition: 'box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.boxShadow = `inset -4px -4px 10px rgba(0,0,0,0.8), 0 0 ${planet.size * 1.8}px ${planet.glow}80, 0 0 ${planet.size * 3}px ${planet.glow}30`
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.boxShadow = `inset -4px -4px 10px rgba(0,0,0,0.8), 0 0 ${planet.size}px ${planet.glow}40`
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-50 mix-blend-screen"
            style={{ boxShadow: `inset 0 0 ${planet.size / 2}px ${planet.glow}` }}
          />
        </div>
        {/* Name label — visible on hover (desktop) or always visible on touch */}
        <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 text-[9px] tracking-[0.2em] text-white/80 whitespace-nowrap pointer-events-none">
          {planet.name}
        </div>
      </motion.div>
    </div>
  )
}

// ─── HeroFrame ────────────────────────────────────────────────────────────────
interface HeroFrameProps {
  onPlanetClick: (planet: Planet) => void
  onKeyClick: () => void
}

export function HeroFrame({ onPlanetClick, onKeyClick }: HeroFrameProps) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const lerpRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>()
  const bgRef = useRef<HTMLDivElement>(null)
  const ringsRef = useRef<SVGSVGElement>(null)
  const planetsRef = useRef<HTMLDivElement>(null)
  // Outer wrapper that replicates xMidYMid slice coordinate mapping for planets
  const planetSceneRef = useRef<HTMLDivElement>(null)
  // Current scale/offset so the parallax tick can normalise displacement
  const scaleRef = useRef({ s: 1, ox: 0, oy: 0 })

  // ── Sync planet container to SVG's xMidYMid slice transform ──────────────
  const syncScene = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const s = Math.max(vw / SVG_W, vh / SVG_H)
    const ox = (vw - SVG_W * s) / 2
    const oy = (vh - SVG_H * s) / 2
    scaleRef.current = { s, ox, oy }
    if (planetSceneRef.current) {
      planetSceneRef.current.style.transform = `translate(${ox}px,${oy}px) scale(${s})`
    }
  }, [])

  useEffect(() => {
    syncScene()
    window.addEventListener('resize', syncScene)
    return () => window.removeEventListener('resize', syncScene)
  }, [syncScene])

  // ── Mouse parallax ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const tick = () => {
      lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * 0.06
      lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * 0.06
      const lx = lerpRef.current.x
      const ly = lerpRef.current.y

      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${lx * 8}px, ${ly * 8}px)`
      }
      if (ringsRef.current) {
        ringsRef.current.style.transform = `translate(${lx * 15}px, ${ly * 15}px)`
      }
      if (planetsRef.current) {
        // Divide by scale so the screen-pixel displacement matches the rings
        const { s } = scaleRef.current
        planetsRef.current.style.transform = `translate(${(lx * 18) / s}px, ${(ly * 18) / s}px)`
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove)
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── DEPTH 0: Background ambient glows ─────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        {/* Amber core glow */}
        <div
          className="absolute"
          style={{
            left: '35%',
            top: '40%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Teal outer glow */}
        <div
          className="absolute"
          style={{
            left: '65%',
            top: '55%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,207,207,0.06) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Violet undertone */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '70%',
            width: 800,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(123,47,190,0.05) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* ── DEPTH 1: Orbital rings SVG ────────────────────────────────────── */}
      {/*
        Ring geometry (viewBox 0 0 1440 900) — each layer's planets sit exactly
        on their ring, nested into a funnel that narrows toward the Meridian:
          Ring 1 (gold)   — Layer 1, outermost → cx=700 cy=365 rx=510 ry=165
          Ring 2 (indigo) — Layer 2, mid       → cx=720 cy=535 rx=340 ry=105
          Ring 3 (red)    — Layer 3, innermost → cx=720 cy=700 rx=145 ry=45
        Planet x/y in data/planets.ts are derived from these ellipses (see
        getPlanetById/getPlanetsByLayer call sites) — keep them in sync if
        ring geometry changes.
      */}
      <svg
        ref={ringsRef as React.Ref<SVGSVGElement>}
        className="absolute inset-0 w-full h-full will-change-transform"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="ring-haze" x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="ring-glow-sm" x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="core-soft" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="core-tight" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="core-hot" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* ── Ring 1: GOLD — Layer 1 planets (outermost) ───────────────────── */}
        {/* cx=700 cy=365 rx=510 ry=165 */}
        <ellipse cx="700" cy="365" rx="510" ry="165"
          fill="none" stroke="rgba(245,200,66,0.28)" strokeWidth="18"
          filter="url(#ring-haze)" />
        <ellipse cx="700" cy="365" rx="510" ry="165"
          fill="none" stroke="rgba(245,200,66,0.18)" strokeWidth="4"
          filter="url(#ring-glow-sm)" />
        <ellipse cx="700" cy="365" rx="510" ry="165"
          fill="none" stroke="rgba(245,200,66,0.55)" strokeWidth="1" />
        <ellipse cx="700" cy="365" rx="510" ry="165"
          fill="none" stroke="rgba(255,235,130,0.20)" strokeWidth="0.4" />

        {/* ── Ring 2: INDIGO — Layer 2 planets (mid) ───────────────────────── */}
        {/* cx=720 cy=535 rx=340 ry=105 */}
        <ellipse cx="720" cy="535" rx="340" ry="105"
          fill="none" stroke="rgba(99,60,220,0.30)" strokeWidth="16"
          filter="url(#ring-haze)" />
        <ellipse cx="720" cy="535" rx="340" ry="105"
          fill="none" stroke="rgba(99,60,220,0.20)" strokeWidth="4"
          filter="url(#ring-glow-sm)" />
        <ellipse cx="720" cy="535" rx="340" ry="105"
          fill="none" stroke="rgba(130,90,255,0.60)" strokeWidth="1" />
        <ellipse cx="720" cy="535" rx="340" ry="105"
          fill="none" stroke="rgba(200,180,255,0.18)" strokeWidth="0.4" />

        {/* ── Ring 3: RED — Layer 3 planets (innermost) ────────────────────── */}
        {/* cx=720 cy=700 rx=145 ry=45 */}
        <ellipse cx="720" cy="700" rx="145" ry="45"
          fill="none" stroke="rgba(220,40,40,0.34)" strokeWidth="14"
          filter="url(#ring-haze)" />
        <ellipse cx="720" cy="700" rx="145" ry="45"
          fill="none" stroke="rgba(220,40,40,0.22)" strokeWidth="4"
          filter="url(#ring-glow-sm)" />
        <ellipse cx="720" cy="700" rx="145" ry="45"
          fill="none" stroke="rgba(255,60,60,0.70)" strokeWidth="1.1" />
        <ellipse cx="720" cy="700" rx="145" ry="45"
          fill="none" stroke="rgba(255,160,160,0.20)" strokeWidth="0.4" />

        {/* ── THE MERIDIAN CORE — singularity at the heart of Ring 3 ───────
            Not a sun: small, dense, and deliberate — the convergence point
            every layer funnels toward. Tight blur radii (vs. the planets'
            120px atmospheric glow) keep it reading as focused, not diffuse. */}
        <g aria-hidden="true">
          <motion.circle
            cx="720" cy="700" r="64"
            fill="rgba(255,255,255,0.09)"
            filter="url(#core-soft)"
            animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '720px 700px' }}
          />
          <motion.circle
            cx="720" cy="700" r="32"
            fill="rgba(220,130,255,0.40)"
            filter="url(#core-tight)"
            animate={{ scale: [1, 1.14, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ transformOrigin: '720px 700px' }}
          />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '720px 700px' }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="720" y1="700"
                x2={720 + Math.cos((deg * Math.PI) / 180) * 56}
                y2={700 + Math.sin((deg * Math.PI) / 180) * 56}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="0.6"
              />
            ))}
          </motion.g>
          <motion.circle
            cx="720" cy="700" r="20"
            fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"
            strokeDasharray="2 6"
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '720px 700px' }}
          />
          <motion.circle
            cx="720" cy="700" r="10"
            fill="#FFFFFF"
            filter="url(#core-hot)"
            animate={{ scale: [1, 1.2, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '720px 700px' }}
          />
          <circle cx="720" cy="700" r="3.5" fill="#FFFFFF" />
        </g>
      </svg>



      {/* ── Planets container (depth 3) ───────────────────────────────────── */}
      {/*
        planetSceneRef replicates xMidYMid slice: its CSS transform is updated
        on mount and resize to match the SVG's scale + offset exactly.
        planetsRef (inner) carries only the parallax translate.
      */}
      <div
        ref={planetSceneRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SVG_W,
          height: SVG_H,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        <div ref={planetsRef} className="absolute inset-0">
          {ALL_PLANETS.map((planet) => (
            <PlanetOrb
              key={planet.id}
              planet={planet}
              onClick={() => onPlanetClick(planet)}
            />
          ))}

          {/*
            Clickable hit zone over The Key / Meridian Core.
            Positioned at SVG coords (720, 700) — the same cx/cy used for
            the Meridian circle in the rings SVG layer.
            translate(-50%,-50%) centres it on that point.
          */}
          <button
            onClick={onKeyClick}
            aria-label="Explore The Key"
            className="absolute group"
            style={{ left: 720, top: 700, transform: 'translate(-50%, -50%)' }}
          >
            {/* Expanding pulse ring — visible hint */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: 'rgba(200,130,255,0.4)', animationDuration: '2.5s' }} />
            {/* Hover glow ring */}
            <span className="absolute -inset-3 rounded-full border border-white/0 group-hover:border-white/20 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(200,130,255,0.4)]" />
            {/* Invisible tap area */}
            <span className="block w-12 h-12 rounded-full" />
          </button>
        </div>
      </div>

      {/* ── Left depth bar (UI overlay — hidden on mobile to reduce clutter) ─ */}
      <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-30" aria-hidden="true">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/20" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-[3px] h-[3px] rounded-full bg-white/30"
            style={{ opacity: 1 - i * 0.15 }}
          />
        ))}
        <div className="w-[1px] h-16 bg-gradient-to-t from-transparent to-white/20" />
        <span
          className="text-[8px] tracking-[0.3em] text-white/20 font-light"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          DEPTH-0
        </span>
      </div>

      {/* ── UI Overlays (no parallax) ─────────────────────────────────────── */}
      {/* Top-left label */}
      <div className="absolute top-4 left-4 md:top-8 md:left-12 z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] text-white/30 mb-1">BVO EXPERIENCE</div>
          <div className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] text-layer1/60">THE RIVER</div>
        </motion.div>
      </div>

      {/* Main title — sits above the orbital scene so it stays legible against the rings */}
      <div className="absolute top-16 md:top-20 inset-x-0 z-30 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1
            className="text-xl md:text-3xl tracking-[0.3em] md:tracking-[0.4em] text-white/90 mb-2 md:mb-3 font-light"
            style={{ textShadow: '0 0 30px rgba(245,200,66,0.5), 0 0 60px rgba(0,0,0,0.8)' }}
          >
            THE RIVER
          </h1>
          <div className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.35em] text-layer1/80">
            SELECT A WORLD TO EXPLORE
          </div>
        </motion.div>
      </div>

      {/* Top-right coordinates — hidden on small screens */}
      <div className="hidden sm:block absolute top-8 right-20 z-30 text-right" aria-hidden="true">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-1"
        >
          <div className="text-[8px] font-mono text-white/20">RA 14h 29m 43s</div>
          <div className="text-[8px] font-mono text-white/20">DEC −62° 40′ 46″</div>
          <div className="text-[8px] font-mono text-layer2-teal/40">LAYER-01 SCAN</div>
        </motion.div>
      </div>

      {/* Bottom-right planet count — shifted up on mobile to avoid home-bar */}
      <motion.div
        className="absolute bottom-16 md:bottom-24 right-4 md:right-8 z-30 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        aria-hidden="true"
      >
        <div className="text-[8px] tracking-[0.3em] text-white/20 mb-1">WORLDS DETECTED</div>
        <div className="text-xl md:text-2xl font-light text-white/60">{ALL_PLANETS.length}</div>
      </motion.div>
    </motion.div>
  )
}
