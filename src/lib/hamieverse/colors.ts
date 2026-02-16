/**
 * Centralized color definitions for the Hamieverse Wiki
 * All faction and character colors should be imported from this file
 */

// Faction colors - used for faction cards, character affiliations, etc.
export const factionColors: Record<string, string> = {
  aetherion: '#EF4444',
  aetherion_elite: '#EF4444',
  ironpaws: '#1F2937',
  ironpaw: '#1F2937',
  section_9: '#DC2626',
  undercode: '#00D9A5',
  respeculators: '#9333EA',
  the_beyond: '#F472B6',
  the_city: '#6B7280',
  independent: '#F59E0B',
};

// Character colors - used for character cards, relationship webs, etc.
export const characterColors: Record<string, string> = {
  hamie: '#F7931A',
  sam: '#627EEA',
  lira: '#9945FF',
  silas: '#DC2626',
  grandma: '#F472B6',
  mitch: '#10B981',
  luna: '#06B6D4',
  '257a': '#6B7280',
  '479c': '#EC4899',
  ironpaws: '#1F2937',
  ace: '#00D9A5',
  hikari: '#00D9A5',
  kael: '#00D9A5',
  orrien: '#F59E0B',
};

// Relationship type colors - used for relationship webs and maps
export const relationshipColors: Record<string, string> = {
  family: '#F472B6',
  workplace: '#60A5FA',
  alliance: '#34D399',
  target: '#FBBF24',
  oppression: '#EF4444',
  enforcement: '#F87171',
  neighbor: '#A78BFA',
  mentor: '#00D9A5',
  rival: '#FF6B6B',
};

// Location colors - used for location cards and maps
export const locationColors: Record<string, string> = {
  'the-city': '#EF4444',
  'the-undercode': '#00D9A5',
  'virella': '#22C55E',
  'aetherion-hq': '#DC2626',
  'the-wheel': '#F7931A',
  'neon-spire': '#9333EA',
};

// Faction icons (string identifiers for use with Icon components)
export const factionIcons: Record<string, string> = {
  aetherion: 'building',
  aetherion_elite: 'building',
  ironpaws: 'sword',
  ironpaw: 'sword',
  section_9: 'target',
  undercode: 'terminal',
  respeculators: 'mask',
  the_beyond: 'leaf',
  the_city: 'factory',
  independent: 'crystal',
};

// Helper function to get faction color with fallback
export function getFactionColor(faction: string): string {
  const key = faction.toLowerCase().replace(/ /g, '_');
  return factionColors[key] || '#888888';
}

// Helper function to get character color with fallback
export function getCharacterColor(characterId: string): string {
  return characterColors[characterId.toLowerCase()] || '#888888';
}

// Helper function to get relationship color with fallback
export function getRelationshipColor(relationshipType: string): string {
  return relationshipColors[relationshipType.toLowerCase()] || '#888888';
}

// Helper function to get location color with fallback
export function getLocationColor(locationId: string): string {
  return locationColors[locationId.toLowerCase()] || '#888888';
}

// Helper function to get faction icon with fallback
export function getFactionIcon(faction: string): string {
  const key = faction.toLowerCase().replace(/ /g, '_');
  return factionIcons[key] || 'sword';
}
