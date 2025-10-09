export const BOOKS = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1Samuel',
  '2Samuel',
  '1Kings',
  '2Kings',
  '1Chronicles',
  '2Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'SongofSolomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1Corinthians',
  '2Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1Thessalonians',
  '2Thessalonians',
  '1Timothy',
  '2Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1Peter',
  '2Peter',
  '1John',
  '2John',
  '3John',
  'Jude',
  'Revelation',
];

export const BOOK_NAMES = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
];

export interface Verse {
  verse: string;
  text: string;
}

export interface Chapter {
  chapter: string;
  verses: Verse[];
}

export interface Book {
  book: string;
  chapters: Chapter[];
}

export async function loadBook(book: string): Promise<Book | null> {
  try {
    const response = await fetch(`/data/${book}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error loading book ${book}:`, error);
    return null;
  }
}

export function getBookDisplayName(bookFileName: string): string {
  const index = BOOKS.indexOf(bookFileName);
  return index !== -1 ? BOOK_NAMES[index] : bookFileName;
}

export function getBookFileName(displayName: string): string {
  const index = BOOK_NAMES.indexOf(displayName);
  return index !== -1 ? BOOKS[index] : displayName;
}
