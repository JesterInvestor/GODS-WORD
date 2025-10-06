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
    const response = await fetch('/data/strongs-hebrew-dictionary.js');
    const text = await response.text();
    // Extract the dictionary object from the JS file
    const match = text.match(/var\s+strongsHebrewDictionary\s*=\s*({[\s\S]*});/);
    if (match) {
      hebrewDictionary = JSON.parse(match[1]);
      return hebrewDictionary!;
    }
  } catch (error) {
    console.error('Error loading Hebrew dictionary:', error);
  }
  return {};
}

export async function loadGreekDictionary(): Promise<StrongsData> {
  if (greekDictionary) return greekDictionary;
  
  try {
    const response = await fetch('/data/strongs-greek-dictionary.js');
    const text = await response.text();
    // Extract the dictionary object from the JS file
    const match = text.match(/var\s+strongsGreekDictionary\s*=\s*({[\s\S]*});/);
    if (match) {
      greekDictionary = JSON.parse(match[1]);
      return greekDictionary!;
    }
  } catch (error) {
    console.error('Error loading Greek dictionary:', error);
  }
  return {};
}

export async function lookupStrongs(reference: string): Promise<{ hebrew?: StrongsEntry; greek?: StrongsEntry }> {
  const result: { hebrew?: StrongsEntry; greek?: StrongsEntry } = {};
  
  // Check if it's a Hebrew reference (starts with H)
  if (reference.startsWith('H')) {
    const hebrew = await loadHebrewDictionary();
    if (hebrew[reference]) {
      result.hebrew = hebrew[reference];
    }
  }
  
  // Check if it's a Greek reference (starts with G)
  if (reference.startsWith('G')) {
    const greek = await loadGreekDictionary();
    if (greek[reference]) {
      result.greek = greek[reference];
    }
  }
  
  return result;
}
