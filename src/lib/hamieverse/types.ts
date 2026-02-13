export interface HamieCharacter {
  id: string;
  displayName: string;
  species?: string;
  roles: string[];
  traits: string[];
  origin?: string;
  home?: string;
  coreConflicts?: string[];
  inventory?: string[];
  arc?: string;
  notableActions?: string[];
  symbolicRole?: string;
  notes?: string;
  relationship?: string;
  location?: string;
  function?: string;
  dynamics?: string;
  speciesNote?: string;
  interest?: string;
  privateContext?: string;
  doctrine?: string[];
  symbols?: string[];
  status?: string;
  notableInfo?: string;
  notableLineSummary?: string;
  meaning?: string;
  summary?: string;
  gifFile?: string;
  color?: string;
  quotes?: string[];
  faction?: string;
}

export interface HamieRelationship {
  a: string;
  b: string;
  type: string;
  valence: string;
}

export interface HamieFaction {
  type: string;
  goals?: string[];
  methods?: string[];
  assets?: string[];
  notes?: string;
  alignment?: string;
  traits?: string[];
  tools?: string[];
  operations?: string[];
  coreConept?: string;
  capabilities?: string[];
  publicFace?: string;
  trueMode?: string;
  doctrine?: string[];
  leaders?: string[];
}

export interface HamieLocation {
  type: string;
  description: string;
  symbolism?: string[];
}

export interface WikiSection {
  title: string;
  content: string | string[];
}
