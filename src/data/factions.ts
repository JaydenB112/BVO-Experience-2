export interface FactionLoreStat {
  label: string
  value: string
}

export interface Faction {
  id: string
  name: string
  color: string
  stance: string
  tagline: string
  lore: {
    subtitle: string
    description: string[]
    stats: FactionLoreStat[]
  }
}

export const ALL_FACTIONS: Faction[] = [
  {
    id: 'meridian',
    name: 'THE MERIDIAN',
    color: '#FFFFFF',
    stance: 'DOMINION',
    tagline: 'Iron dominion · Empire of the layers',
    lore: {
      subtitle: 'THE IRON AUTHORITY',
      description: [
        'The Meridian began as an administrative council tasked with maintaining safe passage through the orbital layers. Over three centuries they consolidated control over every toll gate, transit hub, and diplomatic relay between the worlds.',
        'What started as governance became empire quietly — without a single declared war, simply by making the alternative increasingly impossible. Today the Meridian controls the infrastructure of reality. They don\'t need armies on every world. They need the chokepoints.',
      ],
      stats: [
        { label: 'CONTROLLED WORLDS', value: '47' },
        { label: 'FLEET CLASS', value: 'CLASS I' },
        { label: 'FOUNDED', value: '3rd Cycle' },
        { label: 'STATUS', value: 'SOVEREIGN' },
      ],
    },
  },
  {
    id: 'tidebloods',
    name: 'THE TIDEBLOODS',
    color: '#2ECFCF',
    stance: 'COMMUNION',
    tagline: 'River seers · Spiritual guardians',
    lore: {
      subtitle: 'SEERS OF THE CURRENT',
      description: [
        'Not a faction by choice. Tidebloods are born — not made. Somewhere in their bloodline, the River left a mark that never fully faded. They feel its current as a physical sensation: pressure behind the eyes before a crossing, warmth in the hands near a convergence point.',
        'The Meridian once tried to catalogue and conscript them. Most went underground. Now they move between worlds in silence, following the River\'s pull, carrying knowledge that cannot be written down — only felt.',
      ],
      stats: [
        { label: 'ORIGIN', value: 'UNKNOWN' },
        { label: 'ACTIVE SEERS', value: 'CLASSIFIED' },
        { label: 'RIVER SENSITIVITY', value: 'CLASS V' },
        { label: 'MERIDIAN STATUS', value: 'HUNTED' },
      ],
    },
  },
  {
    id: 'drift',
    name: 'THE DRIFT',
    color: '#F5C842',
    stance: 'LIBERATION',
    tagline: 'Free worlds · No masters',
    lore: {
      subtitle: 'THE UNMOORED',
      description: [
        'The Drift is what remains after the Meridian absorbed the last independent council. Fourteen worlds refused the terms. Seven were blockaded into compliance. The remaining seven scattered — some into deep orbit, some into the spaces between layers that no official map acknowledges.',
        'They have no capital, no fleet, no unified command. What they have is the memory of what it felt like before, and the shared understanding that the Meridian will never stop expanding until there is nothing left to absorb.',
      ],
      stats: [
        { label: 'KNOWN CELLS', value: '14' },
        { label: 'HOME SYSTEM', value: 'NONE' },
        { label: 'FOUNDED', value: 'After the Collapse' },
        { label: 'RESOLVE', value: 'ABSOLUTE' },
      ],
    },
  },
  {
    id: 'starguild',
    name: 'THE STAR GUILD',
    color: '#9B3FDE',
    stance: 'ACQUISITION',
    tagline: 'Open contracts · No conscience',
    lore: {
      subtitle: 'THE OPEN LEDGER',
      description: [
        'The Star Guild predates every other faction. When the first worlds began trading across the orbital layers, there were disputes — over cargo, over borders, over debts. The Guild formed to resolve them, by force if required, for a fee in all cases.',
        'They have brokered truces, extracted hostages, delivered ultimatums, and occasionally started the wars that paid for three more. They have survived every regime change in the Familiar Skies by being the one thing every side needs: someone willing to do the work no one else will admit to.',
      ],
      stats: [
        { label: 'FOUNDED', value: 'Pre-history' },
        { label: 'CONTRACTS', value: '∞' },
        { label: 'ALLEGIANCE', value: 'NONE' },
        { label: 'RATE', value: 'NEGOTIABLE' },
      ],
    },
  },
]

export const getFactionById = (id: string): Faction | undefined =>
  ALL_FACTIONS.find(f => f.id === id)
