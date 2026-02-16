import loreData from './lore.json';
import comicsData from './comics.json';
import { HamieCharacter, HamieRelationship, HamieFaction } from './types';
import { characterColors, getCharacterColor } from './colors';

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

// Character quotes
const characterQuotes: Record<string, string[]> = {
  hamie: [
    "The City never sleeps, and neither do its cameras.",
    "Sometimes the only way out is through.",
    "I remember the grass. I remember the firelight. I won't let them take that too.",
  ],
  sam: [
    "Influence is the point, not trust.",
    "Use rebellion as mask to evade scrutiny while amassing power.",
    "Burn enough to light the path, not enough to destroy the fuel.",
  ],
  lira: [
    "Trust is a currency. Spend it wisely.",
    "Everyone wants something. The trick is knowing what.",
  ],
  '257a': [
    "Fall out of the Wheel, and you'll be ground under it.",
    "Burnout isn't weakness. It's survival.",
  ],
  luna: [
    "You're running on empty, Simba. Even stars burn out.",
  ],
  ace: [
    "An echo raid isn't just noise—it's a symphony of chaos.",
    "In the Undercode, attention is power. Use it.",
  ],
  hikari: [
    "Every system has a seam. You just have to find it.",
    "Code doesn't lie. People do.",
  ],
  kael: [
    "I wore the visor. I know what they're capable of.",
    "Some orders you can't follow and still call yourself alive.",
  ],
  orrien: [
    "Information flows like water. I'm just the riverbed.",
    "Loyalty is expensive. I deal in cheaper currencies.",
  ],
};

// Character factions
const characterFactions: Record<string, string> = {
  hamie: 'Undercode',
  sam: 'Respeculators',
  lira: 'Respeculators',
  silas: 'Aetherion Elite',
  grandma: 'The Beyond',
  mitch: 'The City',
  '257a': 'The City',
  '479c': 'The City',
  ace: 'Undercode',
  hikari: 'Undercode',
  kael: 'Undercode',
  orrien: 'Aetherion Elite',
  luna: 'Undercode',
  alistair_veynar: 'Aetherion Elite',
  veynar_mother: 'Aetherion Elite',
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
    summary: data.summary,
    gifFile: characterGifs[key.toLowerCase()] || undefined,
    color: getCharacterColor(key),
    quotes: characterQuotes[key.toLowerCase()] || undefined,
    faction: characterFactions[key.toLowerCase()] || undefined,
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
      const normalizedKey = key.toLowerCase();
      const existing = characters.find(c => c.id.toLowerCase() === normalizedKey);
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
    const aIndex = mainChars.indexOf(a.id.toLowerCase());
    const bIndex = mainChars.indexOf(b.id.toLowerCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.displayName.localeCompare(b.displayName);
  });
}

export function getCharacter(id: string): HamieCharacter | null {
  const characters = getAllCharacters();
  const normalizedId = id.toLowerCase();
  return characters.find(c => c.id.toLowerCase() === normalizedId) || null;
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
