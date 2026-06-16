import type { Planet } from '../types'

export const ALL_PLANETS: Planet[] = [
  {
    id: 'aurentum',
    name: 'AURENTUM',
    layer: 1,
    x: 167, y: 351, size: 48,
    color1: '#F5C842', color2: '#8B5A00', glow: '#F5C842',
    delay: 0,
    lore: {
      subtitle: 'LAYER 1 · ORBIT 1',
      description: [
        'The oldest world in the Familiar Skies. Its burnished surface holds the records of the first descent, etched into the golden crust by forces that predate the rings.',
        'Atmospheric density is high, rich in amber particulate that catches the light of The River as it passes overhead. It feels solid, ancient, and undeniably important.'
      ],
      stats: [
        { label: 'SURFACE TEMP', value: '1,420°K' },
        { label: 'RIVER PROXIMITY', value: '0.4 AU', color: 'text-layer1' },
        { label: 'AGE ESTIMATE', value: '14.2 Gyr' },
        { label: 'GRAVITY', value: '2.3× std' }
      ],
      cta: 'INITIATE DESCENT'
    }
  },
  {
    id: 'velmoris',
    name: 'VELMORIS',
    layer: 1,
    x: 1152, y: 284, size: 28,
    color1: '#A3E635', color2: '#166534', glow: '#A3E635',
    delay: 1,
    lore: {
      subtitle: 'LAYER 1 · ORBIT 2',
      description: [
        'A verdant world cloaked in bioluminescent canopy. The forests here pulse with a rhythm that mirrors The River — some theorize it was seeded intentionally.',
        'Oxygen-rich atmosphere supports complex life unlike anything in the lower layers. The green glow from orbit is visible across the Familiar Skies.'
      ],
      stats: [
        { label: 'ATMOSPHERIC O₂', value: '31%', color: 'text-green-400' },
        { label: 'RIVER PROXIMITY', value: '1.2 AU' },
        { label: 'BIOME DIVERSITY', value: 'CLASS IX' },
        { label: 'NIGHT LUMINANCE', value: '4.7 klux' }
      ],
      cta: 'ENTER CANOPY'
    }
  },
  {
    id: 'drakmoor',
    name: 'DRAKMOOR',
    layer: 1,
    x: 922, y: 493, size: 36,
    color1: '#0F172A', color2: '#020617', glow: '#2ECFCF',
    delay: 2,
    lore: {
      subtitle: 'LAYER 1 · ORBIT 3',
      description: [
        'An almost lightless world that generates its own aurora from within. The teal light emanates from deep magnetic vents, painting the sky in impossible colors.',
        'Harsh and beautiful in equal measure. Navigation here requires instruments calibrated to the magnetic variance that shifts without pattern or prediction.'
      ],
      stats: [
        { label: 'SURFACE LIGHT', value: '0.02 lux' },
        { label: 'MAGNETIC FLUX', value: '847 nT', color: 'text-layer2-teal' },
        { label: 'AURORA FREQ', value: 'CONSTANT' },
        { label: 'TEMP RANGE', value: '-180 / -40°K' }
      ],
      cta: 'NAVIGATE DARK'
    }
  },
  {
    id: 'solenne',
    name: 'SOLENNE',
    layer: 1,
    x: 439, y: 214, size: 16,
    color1: '#FFFFFF', color2: '#E2E8F0', glow: '#FFFFFF',
    delay: 3,
    lore: {
      subtitle: 'LAYER 1 · MOON',
      description: [
        'A small crystalline moon of pure white composition. Serene silence permeates its surface — no wind, no weather, no sound. Only the hum of deep space.',
        'Its crystalline lattice structure refracts The River light into spectrum bands visible from neighboring orbits. Many pilgrims come here simply to sit.'
      ],
      stats: [
        { label: 'SURFACE AREA', value: '0.08 Std' },
        { label: 'SOUND LEVEL', value: '0 dB' },
        { label: 'CRYSTAL PURITY', value: '99.97%' },
        { label: 'LIGHT REFRACT', value: 'CLASS I' }
      ],
      cta: 'FIND SILENCE'
    }
  },
  {
    id: 'mnemovex',
    name: 'MNEMOVEX',
    layer: 2,
    x: 372, y: 497, size: 32,
    color1: '#E2E8F0', color2: '#7B2FBE', glow: '#7B2FBE',
    delay: 0.5,
    lore: {
      subtitle: 'LAYER 2 · DEEP ORBIT',
      description: [
        'A memory-world with an iridescent surface that shifts color based on what you remember. No two observers see the same planet. Reality feels unstable here in ways that are difficult to document.',
        'The violet depths contain compressed time — experiences from visitors persist on the surface long after they have departed. The planet remembers everything.'
      ],
      stats: [
        { label: 'REALITY INDEX', value: '0.31 STB', color: 'text-purple-400' },
        { label: 'MEMORY DENSITY', value: '∞ TB/m³' },
        { label: 'OBSERVER COUNT', value: 'VARIABLE' },
        { label: 'LAYER DEPTH', value: '2.4 STD' }
      ],
      cta: 'ENTER MEMORY'
    }
  },
  {
    id: 'caelundra',
    name: 'CAELUNDRA',
    layer: 2,
    x: 984, y: 573, size: 40,
    color1: '#3B82F6', color2: '#1E3A8A', glow: '#3B82F6',
    delay: 1.5,
    lore: {
      subtitle: 'LAYER 2 · DEEP ORBIT',
      description: [
        'A cobalt giant where rain falls upward. The impossible oceans float at altitude, defying every gravitational model established in the upper layers.',
        'The blue light emitted from its core suggests a form of energy generation that has no analogue elsewhere in the system. Scientists who study it rarely return unchanged.'
      ],
      stats: [
        { label: 'OCEAN ALTITUDE', value: '12-40 km', color: 'text-blue-400' },
        { label: 'RAIN DIRECTION', value: 'UPWARD' },
        { label: 'CORE TEMP', value: '∞°K' },
        { label: 'GRAVITY', value: 'INVERTED' }
      ],
      cta: 'DEFY GRAVITY'
    }
  },
  {
    id: 'vorrith',
    name: 'VORRITH',
    layer: 2,
    x: 867, y: 430, size: 24,
    color1: '#D97706', color2: '#451A03', glow: '#D97706',
    delay: 2.5,
    lore: {
      subtitle: 'LAYER 2 · DEEP ORBIT',
      description: [
        'An ember world, volcanic and ancient. The crust fractures across the entire surface, and through every crack bleeds amber light from the magma that has never cooled.',
        'Vorrith is theorized to be a fragment of something far larger — the scars on its surface suggest a catastrophic event that no record has survived to explain.'
      ],
      stats: [
        { label: 'SURFACE FRACTURES', value: '12,440' },
        { label: 'LAVA FLOW RATE', value: '4.2 km/hr', color: 'text-orange-400' },
        { label: 'CRUST AGE', value: '> 20 Gyr' },
        { label: 'MAGMA DEPTH', value: '0 km' }
      ],
      cta: 'STUDY THE SCARS'
    }
  },
  {
    id: 'othren',
    name: 'OTHREN',
    layer: 2,
    x: 553, y: 618, size: 20,
    color1: '#22C55E', color2: '#475569', glow: '#22C55E',
    delay: 3.5,
    lore: {
      subtitle: 'LAYER 2 · DEEP ORBIT',
      description: [
        'A small verdant world where time moves strangely. Travelers report spending what feels like hours but returning to find days have passed. Or the reverse.',
        'The green surface is lush and welcoming, which makes the temporal anomalies all the more disorienting. Beautiful places often hide the strangest physics.'
      ],
      stats: [
        { label: 'TIME DRIFT RATIO', value: '1:0.3 / 1:7', color: 'text-green-400' },
        { label: 'SURFACE CLASS', value: 'VERDANT' },
        { label: 'TEMPORAL ZONES', value: '14' },
        { label: 'SAFE ZONES', value: '3' }
      ],
      cta: 'ENTER TIMEFLOW'
    }
  },
  {
    id: 'nullen',
    name: 'NULLEN',
    layer: 3,
    x: 603, y: 719, size: 24,
    color1: '#000000', color2: '#000000', glow: '#FFFFFF',
    delay: 1,
    border: 'border border-white/40',
    lore: {
      subtitle: 'LAYER 3 · TERMINUS ORBIT',
      description: [
        'A void world that appears entirely empty. Instruments read nothing. Sensors return zero on every channel. And yet something is unmistakably present.',
        'The prevailing theory is that NULLEN contains everything — compressed to a state beyond measurement. Standing on its surface, if it has one, is reported to feel like standing inside a held breath.'
      ],
      stats: [
        { label: 'MASS READING', value: 'NULL' },
        { label: 'ENERGY READING', value: 'NULL / ∞' },
        { label: 'LAYER DEPTH', value: '3.0 STD' },
        { label: 'SURFACE STATE', value: 'UNKNOWN' }
      ],
      cta: 'APPROACH VOID'
    }
  },
  {
    id: 'erathis',
    name: 'ERATHIS',
    layer: 3,
    x: 849, y: 677, size: 18,
    color1: '#FF2020', color2: '#7B2FBE', glow: '#FF2020',
    delay: 2,
    lore: {
      subtitle: 'LAYER 3 · TERMINUS ORBIT',
      description: [
        'Crimson and violet — the closest world to The Meridian. Reality bleeds here in visible ways. Edges of solid objects blur. The horizon flickers.',
        'ERATHIS is the last world before the terminus. Those who have reached it describe the experience of The Meridian as something that cannot be translated into language familiar to the upper layers.'
      ],
      stats: [
        { label: 'MERIDIAN DIST', value: '0.02 AU', color: 'text-layer3-crimson' },
        { label: 'REALITY BLEED', value: 'ACTIVE' },
        { label: 'LAYER DEPTH', value: '3.9 STD' },
        { label: 'RETURN RATE', value: '61%' }
      ],
      cta: 'REACH THE EDGE'
    }
  }
]

export const getPlanetById = (id: string): Planet | undefined =>
  ALL_PLANETS.find(p => p.id === id)

export const getPlanetsByLayer = (layer: 1 | 2 | 3): Planet[] =>
  ALL_PLANETS.filter(p => p.layer === layer)
