import loreData from './lore.json';
import comicsData from './comics.json';
import { HamieCharacter, HamieRelationship, HamieFaction } from './types';

// Character GIF mappings
const characterGifs: Record<string, string> = {
  hamie: 'HamieCharacter.gif',
  sam: 'SamCharacter.gif',
  lira: 'LiraCharacter.gif',
  silas: 'SilasCharacter.gif',
  ace: 'AceCharacter.gif',
  hikari: 'HikariCharacter.gif',
  kael: 'KaelCharacter.gif',
  orrien: 'OrrienCharacter.gif',
};

// Character colors
const characterColors: Record<string, string> = {
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
};

// Transform raw character data into wiki-friendly format
function transformCharacter(key: string, data: any): HamieCharacter {
  return {
    id: key,
    displayName: data.display_name || data.name || key,
    species: data.species || data.species_note,
    roles: data.roles || (data.role ? [data.role] : []),
    traits: data.traits || [],
    origin: data.origin,
    home: data.home,
    coreConflicts: data.core_conflicts,
    inventory: data.inventory,
    arc: data.arc,
    notableActions: data.notable_actions,
    symbolicRole: data.symbolic_role,
    notes: data.notes,
    relationship: data.relationship,
    location: data.location,
    function: data.function,
    dynamics: data.dynamics,
    speciesNote: data.species_note,
    interest: data.interest_in_simba || data.interest,
    privateContext: data.private_context,
    doctrine: data.doctrine,
    symbols: data.symbols,
    status: data.status,
    notableInfo: data.notable_info,
    notableLineSummary: data.notable_line_summary,
    meaning: data.meaning,
    gifFile: characterGifs[key.toLowerCase()] || undefined,
    color: characterColors[key.toLowerCase()] || '#888888',
  };
}

// Get all characters from both lore sources
export function getAllCharacters(): HamieCharacter[] {
  const characters: HamieCharacter[] = [];
  const seen = new Set<string>();

  // From main lore file
  if (loreData.characters) {
    for (const [key, data] of Object.entries(loreData.characters)) {
      if (!seen.has(key)) {
        characters.push(transformCharacter(key, data));
        seen.add(key);
      }
    }
  }

  // From comics file - merge additional character data
  if ((comicsData as any).entities?.characters) {
    for (const [key, data] of Object.entries((comicsData as any).entities.characters)) {
      const existing = characters.find(c => c.id === key);
      if (existing) {
        // Merge additional data
        const comicChar = data as any;
        if (comicChar.aliases) existing.roles = Array.from(new Set([...existing.roles, ...(comicChar.aliases || [])]));
        if (comicChar.motivations) existing.coreConflicts = comicChar.motivations;
        if (comicChar.notable_traits) existing.traits = Array.from(new Set([...existing.traits, ...(comicChar.notable_traits || [])]));
      } else if (!seen.has(key)) {
        characters.push(transformCharacter(key, data));
        seen.add(key);
      }
    }
  }

  return characters.sort((a, b) => {
    // Sort main characters first
    const mainChars = ['hamie', 'sam', 'lira', 'silas', 'grandma'];
    const aIndex = mainChars.indexOf(a.id);
    const bIndex = mainChars.indexOf(b.id);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.displayName.localeCompare(b.displayName);
  });
}

export function getCharacter(id: string): HamieCharacter | null {
  const characters = getAllCharacters();
  return characters.find(c => c.id === id || c.id === id.toLowerCase()) || null;
}

export function getRelationships(): HamieRelationship[] {
  return loreData.relationships || [];
}

export function getCharacterRelationships(characterId: string): HamieRelationship[] {
  const relationships = getRelationships();
  return relationships.filter(r =>
    r.a === characterId ||
    r.b === characterId ||
    r.a.toLowerCase() === characterId.toLowerCase() ||
    r.b.toLowerCase() === characterId.toLowerCase()
  );
}

export function getFactions(): Record<string, HamieFaction> {
  return loreData.factions || {};
}

export function getGlossary(): Record<string, string> {
  return loreData.glossary || {};
}

export function getThemes(): string[] {
  return loreData.themes || [];
}

export function getWorldRules(): any {
  return loreData.world_rules || {};
}

export function getSetting(): any {
  return loreData.setting || {};
}

export function getPlotOutline(): any {
  return loreData.plot_outline || {};
}

export function getLogline(): string {
  return loreData.logline || '';
}

export function getToneAndStyle(): any {
  return loreData.tone_and_style || {};
}

export function getMotifs(): any {
  return loreData.motifs_and_symbols || {};
}
