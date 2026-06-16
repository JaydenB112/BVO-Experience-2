import type { Faction } from '../data/factions'

export interface Planet {
  id: string
  name: string
  layer: 1 | 2 | 3
  x: number
  y: number
  size: number
  color1: string
  color2: string
  glow: string
  delay: number
  border?: string
  lore: PlanetLore
}

export interface PlanetLore {
  subtitle: string
  description: string[]
  stats: PlanetStat[]
  cta: string
}

export interface PlanetStat {
  label: string
  value: string
  color?: string
}

export interface Frame {
  id: number
  label: string
  color: string
  text: string
}

export type AppAction =
  | { type: 'SET_FRAME'; payload: number }
  | { type: 'SET_PLANET'; payload: Planet | null }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_KEY' }
  | { type: 'CLOSE_KEY' }
  | { type: 'OPEN_FACTION'; payload: Faction }
  | { type: 'CLOSE_FACTION' }
  | { type: 'SET_TRANSITIONING'; payload: boolean }

export interface AppState {
  currentFrame: number
  selectedPlanet: Planet | null
  selectedFaction: Faction | null
  showKey: boolean
  isTransitioning: boolean
}
