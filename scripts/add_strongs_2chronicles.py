#!/usr/bin/env python3
"""
Add Strong's Concordance numbers to 2 Chronicles JSON file.

This script uses the STEPBible TAHOT data to add Strong's numbers to 2 Chronicles.
It focuses on adding Strong's to significant words (proper nouns, key verbs, important nouns)
while leaving function words unmarked, similar to the pattern in 1 Chronicles.

Usage:
    python3 scripts/add_strongs_2chronicles.py <tahot_file>
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set

# Words that typically don't get Strong's numbers (articles, prepositions, etc.)
SKIP_WORDS = {
    'a', 'an', 'and', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'had', 'has', 'have',
    'he', 'her', 'him', 'his', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'our',
    'she', 'so', 'that', 'the', 'their', 'them', 'there', 'these', 'they', 'this', 'those',
    'to', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'who', 'will', 'with',
    'you', 'your', 'up', 'out', 'into', 'upon', 'unto', 'all', 'not', 'than', 'then',
}

def parse_tahot_line(line: str) -> Tuple[int, int, int, str, List[str]]:
    """
    Parse a TAHOT line for 2 Chronicles.
    Returns: (chapter, verse, word_num, english_gloss, strongs_list)
    """
    parts = line.split('\t')
    if len(parts) < 5:
        return None
    
    # Parse reference like "2Ch.1.1#01=L"
    ref_match = re.match(r'2Ch\.(\d+)\.(\d+)#(\d+)', parts[0])
    if not ref_match:
        return None
    
    chapter, verse, word_num = map(int, ref_match.groups())
    
    # Get English gloss (column 3)
    english_gloss = parts[3].strip() if len(parts) > 3 else ""
    # Remove brackets and slashes for comparison
    english_gloss = re.sub(r'[\[\]/<>]', '', english_gloss).lower()
    
    # Extract Strong's numbers from column 4, filtering out grammatical markers (H9xxx)
    strongs_col = parts[4] if len(parts) > 4 else ""
    strongs_numbers = [s for s in re.findall(r'H\d+[A-Z]?', strongs_col) if not s.startswith('H9')]
    
    return (chapter, verse, word_num, english_gloss, strongs_numbers)

def load_tahot_data(tahot_file: str) -> Dict[Tuple[int, int], List[Tuple[str, List[str]]]]:
    """
    Load TAHOT data for 2 Chronicles.
    Returns: dict mapping (chapter, verse) to list of (english_gloss, strongs_list) tuples
    """
    print(f"Loading TAHOT data from {tahot_file}...")
    verse_data = {}
    line_count = 0
    
    with open(tahot_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.startswith('2Ch.'):
                continue
            
            line_count += 1
            parsed = parse_tahot_line(line)
            if not parsed:
                continue
            
            chapter, verse, word_num, english_gloss, strongs_numbers = parsed
            
            key = (chapter, verse)
            if key not in verse_data:
                verse_data[key] = []
            
            if strongs_numbers:
                verse_data[key].append((english_gloss, strongs_numbers))
    
    print(f"Processed {line_count} TAHOT lines")
    print(f"Loaded data for {len(verse_data)} verses")
    return verse_data

def find_best_word_match(word: str, glosses: List[str], used_indices: Set[int]) -> int:
    """
    Find the best matching gloss for a given English word.
    Returns the index of the best match, or -1 if no good match found.
    """
    word_clean = re.sub(r'[^\w]', '', word).lower()
    
    for i, gloss in enumerate(glosses):
        if i in used_indices:
            continue
        
        gloss_words = gloss.split()
        for gw in gloss_words:
            if word_clean == gw or word_clean.startswith(gw) or gw.startswith(word_clean):
                if len(word_clean) > 2 and len(gw) > 2:  # Avoid very short matches
                    return i
    
    return -1

def add_strongs_to_verse(verse_text: str, tahot_words: List[Tuple[str, List[str]]]) -> str:
    """
    Add Strong's numbers to a KJV verse text using TAHOT data.
    
    Strategy:
    - Skip common function words
    - Match significant words with Hebrew glosses
    - Add first Strong's number when a good match is found
    """
    if not tahot_words:
        return verse_text
    
    # Split verse into words, preserving spaces and punctuation
    word_pattern = r"(\w+['\u2019]?\w*|[^\w]+)"
    tokens = re.findall(word_pattern, verse_text)
    
    # Track which TAHOT entries we've used
    used_indices = set()
    
    # Build modified verse
    result = []
    
    for token in tokens:
        # Check if it's a word (not whitespace or punctuation)
        if re.match(r'\w', token):
            word_clean = token.lower()
            
            # Skip if it's a common function word
            if word_clean in SKIP_WORDS:
                result.append(token)
                continue
            
            # Try to find a matching gloss
            glosses = [g for g, _ in tahot_words]
            match_idx = find_best_word_match(token, glosses, used_indices)
            
            if match_idx >= 0:
                _, strongs = tahot_words[match_idx]
                if strongs:
                    result.append(f"{token}[{strongs[0]}]")
                    used_indices.add(match_idx)
                else:
                    result.append(token)
            else:
                result.append(token)
        else:
            # Whitespace or punctuation - keep as is
            result.append(token)
    
    return ''.join(result)

def process_2chronicles(tahot_file: str):
    """
    Main processing function to add Strong's numbers to 2 Chronicles.
    """
    input_path = Path(__file__).parent.parent / 'public' / 'data' / '2Chronicles.json'
    output_path = input_path  # Overwrite the original
    backup_path = input_path.with_suffix('.json.bak')
    
    # Load TAHOT data
    tahot_data = load_tahot_data(tahot_file)
    
    # Load 2 Chronicles JSON
    print(f"\nLoading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        bible_data = json.load(f)
    
    # Create backup
    print(f"Creating backup at {backup_path}...")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, indent=2, ensure_ascii=False)
    
    # Process verses
    print("\nAdding Strong's numbers to verses...")
    verses_modified = 0
    verses_with_data = 0
    
    for chapter in bible_data['chapters']:
        chapter_num = int(chapter['chapter'])
        
        for verse in chapter['verses']:
            verse_num = int(verse['verse'])
            key = (chapter_num, verse_num)
            
            if key in tahot_data:
                verses_with_data += 1
                original_text = verse['text']
                modified_text = add_strongs_to_verse(original_text, tahot_data[key])
                
                if modified_text != original_text:
                    verse['text'] = modified_text
                    verses_modified += 1
                    
                    # Show first few examples
                    if verses_modified <= 5:
                        print(f"\n  2 Chronicles {chapter_num}:{verse_num}")
                        print(f"    Before: {original_text[:100]}...")
                        print(f"    After:  {modified_text[:100]}...")
    
    print(f"\nSummary:")
    print(f"  Total verses: {sum(len(ch['verses']) for ch in bible_data['chapters'])}")
    print(f"  Verses with TAHOT data: {verses_with_data}")
    print(f"  Verses modified: {verses_modified}")
    
    # Write output
    print(f"\nWriting updated data to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, indent=2, ensure_ascii=False)
    
    print("Done!")
    print(f"Backup saved to: {backup_path}")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/add_strongs_2chronicles.py <tahot_file>")
        print("\nExample:")
        print('  python3 scripts/add_strongs_2chronicles.py "/tmp/STEPBible-Data/Translators Amalgamated OT+NT/TAHOT Jos-Est - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt"')
        sys.exit(1)
    
    tahot_file = sys.argv[1]
    
    if not Path(tahot_file).exists():
        print(f"Error: TAHOT file not found: {tahot_file}")
        sys.exit(1)
    
    process_2chronicles(tahot_file)
