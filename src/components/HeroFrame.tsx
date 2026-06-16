import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ALL_PLANETS } from '../data/planets'
import { TheRiver } from './TheRiver'
import type { Planet } from '../types'

// ─── Planet Orb sub-component ────────────────────────────────────────────────
function PlanetOrb({
  planet,
  onClick,
}: {
  planet: Planet
  onClick: () => void
}) {
  return (
    <motion.div
      className="absolute flex flex-col items-center group cursor-pointer z-20"
      style={{ left: planet.x, top: planet.y }}
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
      {/* Hover label */}
      <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] tracking-[0.2em] text-white/80 whitespace-nowrap pointer-events-none">
        {planet.name}
      </div>
    </motion.div>
  )
}

// ─── HeroFrame ────────────────────────────────────────────────────────────────
interface HeroFrameProps {
  onPlanetClick: (planet: Planet) => void
}

export function HeroFrame({ onPlanetClick }: HeroFrameProps) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const lerpRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>()
  const bgRef = useRef<HTMLDivElement>(null)
  const ringsRef = useRef<SVGSVGElement>(null)
  const riverRef = useRef<SVGSVGElement>(null)
  const planetsRef = useRef<HTMLDivElement>(null)

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
      if (riverRef.current) {
        riverRef.current.style.transform = `translate(${lx * 20}px, ${ly * 20}px)`
      }
      if (planetsRef.current) {
        planetsRef.current.style.transform = `translate(${lx * 18}px, ${ly * 18}px)`
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
        Ring geometry fitted to planet positions (viewBox 0 0 1440 900):
          Ring 1 (gold)   — Layer 1 planets: Aurentum(220,350), Velmoris(1180,280),
                            Drakmoor(950,510), Solenne(450,220)
                            → cx=700 cy=365 rx=510 ry=165
          Ring 2 (indigo) — Layer 2 planets: Mnemovex(420,500), Caelundra(1020,580),
                            Vorrith(850,440), Othren(550,620)
                            → cx=720 cy=535 rx=340 ry=105
          Ring 3 (red)    — Layer 3 planets: Nullen(600,720), Erathis(820,680)
                            → cx=720 cy=700 rx=145 ry=45
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
      </svg>

      {/* ── DEPTH 2: The River — SVG spiral on same plane as planets ─── */}
      {/* TheRiver hidden temporarily */}
      {/* <TheRiver ref={riverRef} className="z-[8]" /> */}

      {/* ── Planets container (depth 3) ───────────────────────────────────── */}
      <div ref={planetsRef} className="absolute inset-0 will-change-transform">
        {ALL_PLANETS.map((planet) => (
          <PlanetOrb
            key={planet.id}
            planet={planet}
            onClick={() => onPlanetClick(planet)}
          />
        ))}
      </div>

      {/* ── Left depth bar (UI overlay — no parallax) ─────────────────────── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30" aria-hidden="true">
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
      <div className="absolute top-8 left-12 z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-[9px] tracking-[0.4em] text-white/30 mb-1">BVO EXPERIENCE</div>
          <div className="text-[9px] tracking-[0.4em] text-layer1/60">THE FAMILIAR SKIES</div>
        </motion.div>
      </div>

      {/* Main title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-[11px] tracking-[0.6em] text-white/20 mb-4 font-light">
            THE FAMILIAR SKIES
          </h1>
          <div className="text-[9px] tracking-[0.3em] text-layer1/40">
            SELECT A WORLD TO EXPLORE
          </div>
        </motion.div>
      </div>

      {/* Top-right coordinates */}
      <div className="absolute top-8 right-20 z-30 text-right" aria-hidden="true">
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

      {/* Bottom-right planet count */}
      <motion.div
        className="absolute bottom-24 right-8 z-30 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        aria-hidden="true"
      >
        <div className="text-[8px] tracking-[0.3em] text-white/20 mb-1">WORLDS DETECTED</div>
        <div className="text-2xl font-light text-white/60">{ALL_PLANETS.length}</div>
      </motion.div>
    </motion.div>
  )
}
