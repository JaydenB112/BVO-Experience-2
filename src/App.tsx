import { useReducer, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Starfield } from './components/Starfield'
import { FrameSwitcher } from './components/FrameSwitcher'
import { HeroFrame } from './components/HeroFrame'
import { PlanetFrame } from './components/PlanetFrame'
import { MeridianFrame } from './components/MeridianFrame'
import { Layer2Frame } from './components/Layer2Frame'
import { PlanetDetailModal } from './components/PlanetDetailModal'
import { CursorGlow } from './components/CursorGlow'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useScrollFrame } from './hooks/useScrollFrame'
import { useScreenInit } from './useScreenInit.js'
import type { AppState, AppAction, Planet } from './types'

const FRAME_TINTS: Record<number, string> = {
  0: '#F5C842',  // amber for hero
  1: '#F5C842',  // amber for planet
  2: '#FFFFFF',  // white for meridian
  3: '#2ECFCF',  // teal for layer2
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FRAME':
      return { ...state, currentFrame: action.payload, isTransitioning: true }
    case 'SET_PLANET':
      return { ...state, selectedPlanet: action.payload }
    case 'CLOSE_MODAL':
      return { ...state, selectedPlanet: null }
    case 'SET_TRANSITIONING':
      return { ...state, isTransitioning: action.payload }
    default:
      return state
  }
}

export function App() {
  const screenInit = useScreenInit()

  const [state, dispatch] = useReducer(reducer, {
    currentFrame: (screenInit as any).currentFrame ?? 0,
    selectedPlanet: null,
    isTransitioning: false,
  })

  const handleFrameChange = useCallback((frame: number) => {
    dispatch({ type: 'SET_FRAME', payload: frame })
    // Clear transitioning flag after animation
    setTimeout(() => dispatch({ type: 'SET_TRANSITIONING', payload: false }), 1500)
  }, [])

  const handlePlanetClick = useCallback((planet: Planet) => {
    dispatch({ type: 'SET_PLANET', payload: planet })
  }, [])

  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' })
  }, [])

  const handleDescend = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' })
    handleFrameChange(state.currentFrame < 3 ? state.currentFrame + 1 : state.currentFrame)
  }, [state.currentFrame, handleFrameChange])

  useKeyboardNav({
    currentFrame: state.currentFrame,
    onFrameChange: handleFrameChange,
    onEscape: handleCloseModal,
    disabled: false,
  })

  useScrollFrame({
    currentFrame: state.currentFrame,
    onFrameChange: handleFrameChange,
    disabled: !!state.selectedPlanet,
  })

  return (
    <div className="w-full h-screen bg-space relative overflow-hidden font-sans text-white">
      {/* Custom Cursor */}
      <CursorGlow />

      {/* Global Starfield */}
      <Starfield
        density={300}
        speed={0.1}
        boosted={state.isTransitioning}
        tintColor={FRAME_TINTS[state.currentFrame]}
      />

      {/* Frame Content */}
      <AnimatePresence mode="wait">
        {state.currentFrame === 0 && (
          <HeroFrame key="hero" onPlanetClick={handlePlanetClick} />
        )}
        {state.currentFrame === 1 && (
          <PlanetFrame key="planet" onDescend={() => handleFrameChange(2)} />
        )}
        {state.currentFrame === 2 && (
          <MeridianFrame key="meridian" />
        )}
        {state.currentFrame === 3 && (
          <Layer2Frame key="layer2" />
        )}
      </AnimatePresence>

      {/* Planet Detail Modal */}
      <AnimatePresence>
        {state.selectedPlanet && (
          <PlanetDetailModal
            planet={state.selectedPlanet}
            onClose={handleCloseModal}
            onDescend={handleDescend}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <FrameSwitcher
        currentFrame={state.currentFrame}
        setFrame={handleFrameChange}
      />

      {/* Keyboard hint */}
      <div className="fixed top-4 right-6 z-40 text-[9px] tracking-[0.2em] text-white/20 font-light">
        ← → NAVIGATE · ESC CLOSE · 1–4 JUMP
      </div>
    </div>
  )
}
