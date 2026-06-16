import { useReducer, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Starfield } from './components/Starfield'
import { FrameSwitcher } from './components/FrameSwitcher'
import { HeroFrame } from './components/HeroFrame'
import { MeridianFrame } from './components/MeridianFrame'
import { Layer2Frame } from './components/Layer2Frame'
import { PlanetCloseupView } from './components/PlanetCloseupView'
import { TheKeyCloseupView } from './components/TheKeyCloseupView'
import { FactionCloseupView } from './components/FactionCloseupView'
import { CursorGlow } from './components/CursorGlow'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useScrollFrame } from './hooks/useScrollFrame'
import { useScreenInit } from './useScreenInit.js'
import type { AppState, AppAction, Planet } from './types'
import type { Faction } from './data/factions'

// Frames: 0 = HERO, 1 = MERIDIAN, 2 = LAYER 2
const FRAME_TINTS: Record<number, string> = {
  0: '#F5C842',  // amber — hero
  1: '#FFFFFF',  // white  — meridian
  2: '#2ECFCF',  // teal  — layer 2
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FRAME':
      return { ...state, currentFrame: action.payload, isTransitioning: true }
    case 'SET_PLANET':
      return { ...state, selectedPlanet: action.payload, showKey: false, selectedFaction: null }
    case 'CLOSE_MODAL':
      return { ...state, selectedPlanet: null }
    case 'OPEN_KEY':
      return { ...state, showKey: true, selectedPlanet: null, selectedFaction: null }
    case 'CLOSE_KEY':
      return { ...state, showKey: false }
    case 'OPEN_FACTION':
      return { ...state, selectedFaction: action.payload, selectedPlanet: null, showKey: false }
    case 'CLOSE_FACTION':
      return { ...state, selectedFaction: null }
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
    selectedFaction: null,
    showKey: false,
    isTransitioning: false,
  })

  const handleFrameChange = useCallback((frame: number) => {
    dispatch({ type: 'SET_FRAME', payload: frame })
    setTimeout(() => dispatch({ type: 'SET_TRANSITIONING', payload: false }), 1500)
  }, [])

  const handlePlanetClick = useCallback((planet: Planet) => {
    dispatch({ type: 'SET_PLANET', payload: planet })
  }, [])

  const handleCloseModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' })
  }, [])

  const handleKeyClick = useCallback(() => {
    dispatch({ type: 'OPEN_KEY' })
  }, [])

  const handleCloseKey = useCallback(() => {
    dispatch({ type: 'CLOSE_KEY' })
  }, [])

  const handleFactionClick = useCallback((faction: Faction) => {
    dispatch({ type: 'OPEN_FACTION', payload: faction })
  }, [])

  const handleCloseFaction = useCallback(() => {
    dispatch({ type: 'CLOSE_FACTION' })
  }, [])

  // Descend from a planet: layer 1 → Meridian (frame 1), layer 2/3 → Layer 2 (frame 2)
  const handleDescend = useCallback(() => {
    const planet = state.selectedPlanet
    dispatch({ type: 'CLOSE_MODAL' })
    const target = planet && planet.layer >= 2 ? 2 : 1
    handleFrameChange(target)
  }, [state.selectedPlanet, handleFrameChange])

  useKeyboardNav({
    currentFrame: state.currentFrame,
    onFrameChange: handleFrameChange,
    onEscape: handleCloseModal,
    disabled: false,
  })

  useScrollFrame({
    currentFrame: state.currentFrame,
    onFrameChange: handleFrameChange,
    disabled: !!state.selectedPlanet || state.showKey || !!state.selectedFaction,
  })

  return (
    <div className="w-full h-screen bg-space relative overflow-hidden font-sans text-white">
      {/* Custom cursor */}
      <CursorGlow />

      {/* Global starfield */}
      <Starfield
        density={300}
        speed={0.1}
        boosted={state.isTransitioning}
        tintColor={FRAME_TINTS[state.currentFrame]}
      />

      {/* Frame content */}
      <AnimatePresence mode="wait">
        {state.currentFrame === 0 && (
          <HeroFrame key="hero" onPlanetClick={handlePlanetClick} onKeyClick={handleKeyClick} />
        )}
        {state.currentFrame === 1 && (
          <MeridianFrame key="meridian" />
        )}
        {state.currentFrame === 2 && (
          <Layer2Frame key="layer2" />
        )}
      </AnimatePresence>

      {/* Planet close-up overlay — triggered by clicking a planet */}
      <AnimatePresence>
        {state.selectedPlanet && (
          <PlanetCloseupView
            key={state.selectedPlanet.id}
            planet={state.selectedPlanet}
            onClose={handleCloseModal}
            onDescend={handleDescend}
          />
        )}
      </AnimatePresence>

      {/* The Key close-up overlay */}
      <AnimatePresence>
        {state.showKey && (
          <TheKeyCloseupView key="the-key" onClose={handleCloseKey} />
        )}
      </AnimatePresence>

      {/* Faction close-up overlay */}
      <AnimatePresence>
        {state.selectedFaction && (
          <FactionCloseupView
            key={state.selectedFaction.id}
            faction={state.selectedFaction}
            onClose={handleCloseFaction}
          />
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <FrameSwitcher
        currentFrame={state.currentFrame}
        setFrame={handleFrameChange}
        onFactionClick={handleFactionClick}
      />

      {/* Keyboard hint */}
      <div className="fixed top-4 right-6 z-40 text-[9px] tracking-[0.2em] text-white/20 font-light">
        ← → NAVIGATE · ESC CLOSE · 1–3 JUMP
      </div>
    </div>
  )
}
