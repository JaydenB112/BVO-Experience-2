import { useRef } from 'react'
import { motion } from 'framer-motion'

interface FrameSwitcherProps {
  currentFrame: number
  setFrame: (index: number) => void
}

export function FrameSwitcher({ currentFrame, setFrame }: FrameSwitcherProps) {
  const frames = [
    { id: 0, label: 'HERO',     color: 'bg-layer1',       text: 'text-layer1' },
    { id: 1, label: 'MERIDIAN', color: 'bg-white',         text: 'text-white' },
    { id: 2, label: 'LAYER 2',  color: 'bg-layer2-teal',   text: 'text-layer2-teal' },
  ]

  const swipeStartX = useRef<number | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return
    const delta = swipeStartX.current - e.clientX
    if (delta > 60 && currentFrame < 2) setFrame(currentFrame + 1)
    else if (delta < -60 && currentFrame > 0) setFrame(currentFrame - 1)
    swipeStartX.current = null
  }

  const frameNum = String(currentFrame + 1).padStart(2, '0')

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Progress bar */}
      <div className="w-[240px] h-[1px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white/50 rounded-full"
          animate={{ width: `${(currentFrame / 2) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>

      {/* Nav pill */}
      <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4">
        {/* Frame counter */}
        <span className="font-mono text-[10px] text-white/30 tracking-widest w-10">
          {frameNum} / 03
        </span>

        <div className="w-[1px] h-4 bg-white/10" />

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
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
