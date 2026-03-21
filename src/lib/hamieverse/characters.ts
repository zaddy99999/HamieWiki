import loreData from './lore.json';
import comicsData from './comics.json';
import { sheetCharacters } from './sheetCharacters';
import { shownNames } from './shownCharacters';
import { HamieCharacter, HamieRelationship, HamieFaction } from './types';
import { characterColors, getCharacterColor } from './colors';

function normStr(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isShownChar(char: HamieCharacter): boolean {
  const idNorm = normStr(char.id);
  const displayNorm = normStr(char.displayName);
  return shownNames.some(name => {
    const nameNorm = normStr(name);
    const firstWord = normStr(name.split(' ')[0]);
    return nameNorm === idNorm || nameNorm === displayNorm || firstWord === displayNorm || idNorm.startsWith(firstWord);
  });
}

// Find sheet data by display name or id (case-insensitive, with first-word matching)
function findSheetChar(key: string, displayName?: string): any {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const firstWord = (s: string) => norm(s.split(/[\s_]/)[0]);
  const keyNorm = norm(key);
  const displayNorm = displayName ? norm(displayName) : '';
  const keyFirst = firstWord(key);
  const displayFirst = displayName ? firstWord(displayName) : '';

  for (const [sheetName, data] of Object.entries(sheetCharacters)) {
    const sheetNorm = norm(sheetName);
    const sheetFirst = firstWord(sheetName);
    // Exact match
    if (sheetNorm === keyNorm) return data;
    if (displayNorm && sheetNorm === displayNorm) return data;
    // First-word match: "orrien" matches "Orrien Veynar", "halo" matches "Halo Chryseos"
    if (sheetFirst === keyFirst) return data;
    if (displayFirst && sheetFirst === displayFirst) return data;
  }
  return null;
}

// Character GIF mappings (animated)
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

// Character PNG mappings (static)
const characterPngs: Record<string, string> = {
  hamie: 'HamieCharacternft.png',
  sam: 'SamCharacter.png',
  lira: 'LiraCharacter.png',
  silas: 'SilasCharacter.png',
  ace: 'AceCharacter.png',
  ace_pudgy: 'AcePudgyCharacter.png',
  hikari: 'HikariCharacter.png',
  kael: 'KaelCharacter.png',
  orrien: 'OrrienCharacter.png',
  alistair_veynar: 'AlistairVeynarCharacter.png',
  halo: 'HaloCharacter.png',
  dog_simba: 'SimbaCharacter.png',
  kira: 'KiraFluxCharacter.png',
  veylor: 'VeylorQuann.png',
  caligo: 'CaligoCharacter.png',
  echo_whisperer: 'EchoWhispererCharacter.png',
  elyndor: 'ElyndorCharacter.png',
  iron_paw: 'IronPawCharacter.png',
  kai_vox: 'KaiVoxCharacter.png',
  lost_sentinel: 'LostSentinelCharacter.png',
  malvoria: 'MalvoriaCharacter.png',
  orrien_veynar: 'OrrienVeynar.png',
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
  iron_paw: 'Aetherion Elite',
  caligo: 'Aetherion Elite',
  lost_sentinel: 'Undercode',
  malvoria: 'Aetherion Elite',
  kai_vox: 'Undercode',
  echo_whisperer: 'Undercode',
  // From comics.json
  kira: 'Aetherion Elite',
  iris: 'Respeculators',
  halo: 'Aetherion Elite',
  weylor: 'Respeculators',
  veylor: 'Respeculators',
  contractor_friend: 'The City',
  pet_companion: 'Undercode',
  homeless_man_under_overpass: 'The City',
  dog_simba: 'Undercode',
};

// Transform raw character data into wiki-friendly format
function transformCharacter(key: string, data: any): HamieCharacter {
  const displayName = data.display_name || data.name || key;
  const sheet = findSheetChar(key, displayName);

  // Parse sheet roles (newline or comma separated) into array
  const sheetRoles = sheet?.role
    ? sheet.role.split(/[\n,]/).map((r: string) => r.trim()).filter(Boolean)
    : undefined;

  // Use sheet name as the URL slug for cleaner URLs (e.g. "orrien_veynar" not "orrien")
  const sheetId = sheet ? sheet.name.toLowerCase().replace(/\s+/g, '_') : null;

  return {
    id: sheetId || key,
    loreKey: sheetId && sheetId !== key ? key : undefined,
    displayName: sheet?.name || displayName,
    species: sheet?.species,
    roles: sheetRoles || [],
    traits: sheet?.traits || [],
    origin: data.origin,
    home: data.home,
    aliases: sheet?.aliases,
    coreConflicts: sheet?.motivations,
    inventory: data.inventory,
    arc: sheet?.arc,
    notableActions: data.notable_actions,
    symbolicRole: data.symbolic_role,
    notes: undefined,
    relationship: sheet?.relationships,
    location: data.location,
    function: data.function,
    dynamics: data.dynamics,
    speciesNote: data.species_note,
    interest: data.interest_in_simba || data.interest,
    privateContext: data.private_context,
    doctrine: data.doctrine,
    symbols: data.symbols,
    status: data.status,
    notableInfo: sheet?.notableInfo,
    notableLineSummary: data.notable_line_summary,
    meaning: data.meaning,
    summary: data.summary,
    gifFile: sheet?.gifFile || characterGifs[key.toLowerCase()] || undefined,
    pngFile: sheet?.pfpFile || characterPngs[key.toLowerCase()] || undefined,
    color: sheet?.color,
    quotes: characterQuotes[key.toLowerCase()] || undefined,
    faction: sheet?.faction,
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

export function getShownCharacters(): HamieCharacter[] {
  return getAllCharacters().filter(isShownChar);
}

export function getCharacter(id: string): HamieCharacter | null {
  const normalizedId = id.toLowerCase();
  const chars = getShownCharacters();
  return (
    chars.find(c => c.id.toLowerCase() === normalizedId) ||
    chars.find(c => c.loreKey?.toLowerCase() === normalizedId) ||
    null
  );
}

export function getRelationships(): HamieRelationship[] {
  return loreData.relationships || [];
}

export function getCharacterRelationships(characterId: string): HamieRelationship[] {
  const relationships = getRelationships();
  const char = getCharacter(characterId);
  const ids = [characterId, char?.loreKey].filter(Boolean).map(s => s!.toLowerCase());
  return relationships.filter(r =>
    ids.includes(r.a.toLowerCase()) || ids.includes(r.b.toLowerCase())
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
