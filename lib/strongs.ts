export interface StrongsEntry {
  lemma?: string;
  xlit?: string;
  translit?: string;
  pron?: string;
  derivation?: string;
  strongs_def: string;
  kjv_def: string;
}

export interface StrongsData {
  [key: string]: StrongsEntry;
}

let hebrewDictionary: StrongsData | null = null;
let greekDictionary: StrongsData | null = null;

export async function loadHebrewDictionary(): Promise<StrongsData> {
  if (hebrewDictionary) return hebrewDictionary;

  try {
    console.log('[loadHebrewDictionary] Fetching Hebrew dictionary...');
    const response = await fetch('/data/strongs-hebrew-dictionary.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    hebrewDictionary = await response.json();
    console.log('[loadHebrewDictionary] Hebrew dictionary loaded successfully');
    return hebrewDictionary!;
  } catch (error) {
    console.error('[loadHebrewDictionary] Error loading Hebrew dictionary:', error);
    throw error;
  }
}

export async function loadGreekDictionary(): Promise<StrongsData> {
  if (greekDictionary) return greekDictionary;

  try {
    console.log('[loadGreekDictionary] Fetching Greek dictionary...');
    const response = await fetch('/data/strongs-greek-dictionary.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    greekDictionary = await response.json();
    console.log('[loadGreekDictionary] Greek dictionary loaded successfully');
    return greekDictionary!;
  } catch (error) {
    console.error('[loadGreekDictionary] Error loading Greek dictionary:', error);
    throw error;
  }
}

export async function lookupStrongs(reference: string): Promise<{
  hebrew?: StrongsEntry;
  greek?: StrongsEntry;
  error?: string;
}> {
  const result: { hebrew?: StrongsEntry; greek?: StrongsEntry; error?: string } = {};

  try {
    console.log('[lookupStrongs] Looking up reference:', reference);

    // Check if it's a Hebrew reference (starts with H)
    if (reference.startsWith('H')) {
      console.log('[lookupStrongs] Loading Hebrew dictionary for:', reference);
      const hebrew = await loadHebrewDictionary();
      if (hebrew[reference]) {
        result.hebrew = hebrew[reference];
        console.log('[lookupStrongs] Found Hebrew entry for:', reference);
      } else {
        console.warn('[lookupStrongs] No Hebrew entry found for:', reference);
        result.error = `Hebrew reference ${reference} not found in dictionary`;
      }
    }

    // Check if it's a Greek reference (starts with G)
    if (reference.startsWith('G')) {
      console.log('[lookupStrongs] Loading Greek dictionary for:', reference);
      const greek = await loadGreekDictionary();
      if (greek[reference]) {
        result.greek = greek[reference];
        console.log('[lookupStrongs] Found Greek entry for:', reference);
      } else {
        console.warn('[lookupStrongs] No Greek entry found for:', reference);
        result.error = `Greek reference ${reference} not found in dictionary`;
      }
    }

    if (!reference.startsWith('H') && !reference.startsWith('G')) {
      const errorMsg = `Invalid Strong's reference format: ${reference}. Must start with H (Hebrew) or G (Greek)`;
      console.error('[lookupStrongs]', errorMsg);
      result.error = errorMsg;
    }
  } catch (error) {
    const errorMsg = `Error looking up Strong's reference ${reference}: ${error}`;
    console.error('[lookupStrongs]', errorMsg);
    result.error = errorMsg;
  }

  return result;
}
