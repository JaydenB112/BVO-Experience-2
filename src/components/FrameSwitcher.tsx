import React, { useRef } from 'react'
import { motion } from 'framer-motion'

interface FrameSwitcherProps {
  currentFrame: number
  setFrame: (index: number) => void
}

const frames = [
  { id: 0, label: 'HERO',     color: 'bg-layer1',      text: 'text-layer1' },
  { id: 1, label: 'PLANET',   color: 'bg-layer1',      text: 'text-layer1' },
  { id: 2, label: 'MERIDIAN', color: 'bg-white',       text: 'text-white' },
  { id: 3, label: 'LAYER 2',  color: 'bg-layer2-teal', text: 'text-layer2-teal' },
]

export function FrameSwitcher({ currentFrame, setFrame }: FrameSwitcherProps) {
  const swipeStartX = useRef<number | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return
    const delta = swipeStartX.current - e.clientX
    if (delta > 60 && currentFrame < 3) setFrame(currentFrame + 1)
    else if (delta < -60 && currentFrame > 0) setFrame(currentFrame - 1)
    swipeStartX.current = null
  }

  const frameNum = String(currentFrame + 1).padStart(2, '0')
  const totalNum = '04'

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Progress bar */}
      <div className="w-[280px] h-[1px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white/50 rounded-full"
          animate={{ width: `${(currentFrame / 3) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>

      {/* Nav bar */}
      <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4">
        {/* Frame counter */}
        <span className="font-mono text-[10px] text-white/30 tracking-widest w-10 shrink-0">
          {frameNum}&nbsp;/&nbsp;{totalNum}
        </span>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-white/10 shrink-0" aria-hidden="true" />

        {/* Frame buttons */}
        {frames.map((frame) => {
          const isActive = currentFrame === frame.id
          return (
            <button
              key={frame.id}
              onClick={() => setFrame(frame.id)}
              aria-label={`Navigate to ${frame.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={`relative text-xs tracking-[0.2em] font-medium transition-colors duration-500 ${
                isActive ? frame.text : 'text-white/40 hover:text-white/70'
              }`}
            >
              {frame.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${frame.color}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
