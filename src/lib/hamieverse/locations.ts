import loreData from './lore.json';
import { locationColors, getLocationColor } from './colors';

export interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  keyFeatures: string[];
  notableCharacters: string[];
  significance: string;
  aestheticTags?: string[];
  symbolism?: string[];
  color: string;
  icon: string;
  mapPosition: { x: number; y: number };
  connections: string[];
}

// Location data combining lore.json with additional details
export const locations: Location[] = [
  {
    id: 'the-city',
    name: 'The City',
    type: 'Industrial Megastructure',
    description: 'A dense vertical city of neon towers, elevated walkways, surveillance screens, and mechanized transit. The City is depicted as a living machine that never stops spinning. Its infrastructure enforces motion via belts, treadmills, and flow systems. Movement is mandatory; stillness reads as a fault in the machine.',
    keyFeatures: [
      'Neon towers and elevated walkways',
      'Constant surveillance via Red Eye cameras',
      'Propaganda broadcast towers',
      'Pod commute grid enforcing movement rhythms',
      'Central Factory industrial core',
      'Sunrise mantra: "Work is purpose. Order is freedom. Obedience is peace."'
    ],
    notableCharacters: ['Hamie (#146B)', '#257A', '#479C', 'Mitch', 'IronPaws'],
    significance: 'The primary setting where citizens are reduced to numbered workers, trapped in regulated loops of commute and labor. The City represents the machinery of oppression - a surveillance state that runs on obedience.',
    aestheticTags: ['neon', 'industrial', 'tower blocks', 'sky bridges', 'retro-futurist tech', 'propaganda signage'],
    symbolism: ['obedience as infrastructure', 'identity suppression', 'motion as control'],
    color: '#EF4444',
    icon: 'factory',
    mapPosition: { x: 50, y: 50 },
    connections: ['the-wheel', 'aetherion-hq', 'neon-spire', 'the-undercode']
  },
  {
    id: 'the-undercode',
    name: 'The Undercode',
    type: 'Shadow Digital Ecosystem',
    description: 'A hidden digital layer accessible via contraband devices like bridge chips and USB shards. The Undercode is a clandestine network where attention and virality function as currency. It exists as a shadow economy capable of destabilizing Aetherion through coordinated operations.',
    keyFeatures: [
      'Ghostlike logos appearing in interface corners',
      'Feeds of coordinated ops and countdowns',
      'Status markers like "Creator Elite"',
      'Echo raids disrupting shadow banks',
      'Viral loops that can overload security AIs',
      'AC (Echo currency) denominating wealth and influence'
    ],
    notableCharacters: ['Simba (Hamie)', 'Ace', 'Hikari', 'Luna'],
    significance: 'The Undercode represents the crack in Aetherion\'s control - a space where influence matters more than compliance. It offers power but at the cost of exposure and danger. Access transforms Hamie from #146B into Simba.',
    aestheticTags: ['ghostlike interfaces', 'pulsing timers', 'viral headlines', 'shimmering code', 'market-chaos as weather'],
    symbolism: ['attention as power', 'information as weapon', 'digital liberation', 'revolution as spectacle'],
    color: '#00D9A5',
    icon: 'terminal',
    mapPosition: { x: 50, y: 70 },
    connections: ['the-city', 'neon-spire', 'respeculators-penthouse']
  },
  {
    id: 'virella',
    name: 'Virella (The Beyond)',
    type: 'Wilderness / Ancestral World',
    description: 'Hamie\'s remembered home in the Beyond - a world of grass under bare paws, woodsmoke, firelight, roasted crickets, and elders\' faces in amber glow. The City claims its sacrifice preserves the Beyond\'s purity, creating a moral alibi for exploitation.',
    keyFeatures: [
      'Fresh grass and open spaces',
      'Woodsmoke and firelight gatherings',
      'Elder councils and oral traditions',
      'Virella Care Facility housing Grandma',
      'Songs and chants that preserve memory',
      'Roasted crickets and earthy concoctions'
    ],
    notableCharacters: ['Grandma', 'Hamie (origin)'],
    significance: 'Virella represents everything the City has stolen - identity, memory, warmth, and freedom. It serves as Hamie\'s emotional anchor and the source of his resistance. The Beyond\'s doctrine seeds resentment in those who remember it.',
    aestheticTags: ['fresh grass', 'woodsmoke', 'firelight amber', 'roasted crickets', 'earthy concoctions'],
    symbolism: ['memory persistence', 'music as encryption', 'freedom before the machine'],
    color: '#22C55E',
    icon: 'leaf',
    mapPosition: { x: 85, y: 25 },
    connections: ['the-city']
  },
  {
    id: 'aetherion-hq',
    name: 'Aetherion HQ',
    type: 'Corporate-State Command Center',
    description: 'The nerve center of the regime that controls the City. Aetherion functions like a state-corporation with ideological programming, portrayed as oppressive and efficiency-obsessed. From here, the surveillance stack is managed, IronPaw operations are coordinated, and the Wheel\'s power is maintained.',
    keyFeatures: [
      'Central command for all surveillance systems',
      'IronPaw deployment coordination',
      'Investigation teams and cleanup operations',
      'Section 9 erasure protocols',
      'Mantra broadcast control',
      'Factory systems management'
    ],
    notableCharacters: ['Silas', 'Alistair Veynar', 'IronPaws', 'Investigation Teams'],
    significance: 'Aetherion HQ represents the apex of control - the source of all suppression. It is the target that the Respeculators and Undercode operatives work against, though some fear there may be an even deeper threat beyond Silas.',
    symbolism: ['regime power', 'corporate authority', 'ideological control'],
    color: '#DC2626',
    icon: 'building',
    mapPosition: { x: 30, y: 30 },
    connections: ['the-city', 'the-wheel']
  },
  {
    id: 'the-wheel',
    name: 'The Wheel',
    type: 'Colossal Energy Construct',
    description: 'A spiraling rail-and-gear structure that serves as both the City\'s power source and its most potent symbol. The Wheel is powered by Hamster Orbs - energy nodes containing living runners acting as batteries. It represents exploitation normalized as infrastructure.',
    keyFeatures: [
      'Spiraling rail-and-gear architecture',
      'Hamster Orbs containing living runners',
      'Cables and conduits feeding the City',
      'Perpetual motion enforcement',
      'Central to the City\'s energy grid',
      'Target of sabotage operations'
    ],
    notableCharacters: ['Living Batteries (runners)'],
    significance: 'The Wheel is the physical manifestation of the system\'s exploitation - citizens mirror the orbs, running endlessly to uphold an impossible machine. It later becomes a target during the Concert-Factory Convergence operation.',
    symbolism: ['exploitation', 'endless obedience', 'the system as machine god', 'perpetual motion as control'],
    color: '#F7931A',
    icon: 'gear',
    mapPosition: { x: 50, y: 25 },
    connections: ['aetherion-hq', 'the-city']
  },
  {
    id: 'neon-spire',
    name: 'Neon Spire',
    type: 'Elite Rendezvous Point',
    description: 'A high-tier district serving as a gateway into Inner Court society. The Neon Spire is where coded invitations are delivered and where Hamie first encounters the Respeculators. It represents the transition point between the runner world and elite machinations.',
    keyFeatures: [
      'Ancient/alien emblem markings',
      'Midnight sharp rendezvous protocols',
      'Pink holographic interfaces',
      'Elite hedonism contrasting with runner life',
      'Inner Court access point',
      'Coded invitation delivery'
    ],
    notableCharacters: ['Sam', 'Lira Veyna', 'Hamie/Simba', 'Iris'],
    significance: 'The Neon Spire is where Hamie\'s transformation accelerates - receiving the invitation to midnight meetings that pull him deeper into the conspiracy. It bridges the gap between Undercode power and Inner Court politics.',
    aestheticTags: ['neon-lit', 'exclusive', 'mysterious', 'high-tier'],
    symbolism: ['elite access', 'invitation as test', 'threshold between worlds'],
    color: '#AE4DAF',
    icon: 'tower',
    mapPosition: { x: 70, y: 45 },
    connections: ['the-city', 'the-undercode', 'respeculators-penthouse']
  }
];

// Additional locations referenced in lore (for completeness)
export const secondaryLocations = [
  {
    id: 'tower-c-12',
    name: 'Tower C-12',
    type: 'Housing Block',
    description: 'Hamie\'s shoebox flat of steel and observation with a ceiling Red Eye camera.',
    parent: 'the-city'
  },
  {
    id: 'central-factory-gates',
    name: 'Central Factory Gates',
    type: 'Industrial Checkpoint',
    description: 'Cold metal teeth opening daily to receive workers into repetition.',
    parent: 'the-city'
  },
  {
    id: 'overpass-ruins',
    name: 'The Overpass Ruins',
    type: 'System Seam',
    description: 'A crumbling underpass beneath the City where the homeless man and dog lived; later becomes an IronPaw hunting ground.',
    parent: 'the-city'
  },
  {
    id: 'respeculators-penthouse',
    name: 'Respeculators Penthouse',
    type: 'High-Rise Penthouse',
    description: 'Neon-lit city views; strategic discussions; pills; late-night charisma; the rebellion-as-mask headquarters.',
    parent: 'neon-spire'
  },
  {
    id: 'virella-care-facility',
    name: 'Virella Care Facility',
    type: 'Institution',
    description: 'Grandma\'s room; distant but emotionally central via calls.',
    parent: 'virella'
  }
];

// Helper functions
export function getAllLocations(): Location[] {
  return locations;
}

export function getLocation(id: string): Location | undefined {
  const normalizedId = id.toLowerCase();
  return locations.find(loc => loc.id.toLowerCase() === normalizedId);
}

export function getLocationConnections(id: string): Location[] {
  const location = getLocation(id);
  if (!location) return [];
  return location.connections
    .map(connId => getLocation(connId))
    .filter((loc): loc is Location => loc !== undefined);
}

export function getLocationsByType(type: string): Location[] {
  return locations.filter(loc => loc.type.toLowerCase().includes(type.toLowerCase()));
}

// Get characters for a location
export function getLocationCharacters(locationId: string): string[] {
  const location = getLocation(locationId);
  return location?.notableCharacters || [];
}
