#!/usr/bin/env python3
"""
Process 2 Chronicles JSON to add or verify Strong's Concordance numbers.

This script can:
1. Validate an input 2 Chronicles JSON file with Strong's numbers
2. Verify the format matches the repository standard (like 1Chronicles.json)
3. Generate a properly formatted output file

Usage:
    python3 process_2chronicles_strongs.py input.json output.json
"""

import json
import sys
import re
from pathlib import Path

# Expected structure for 2 Chronicles
EXPECTED_CHAPTERS = 36
EXPECTED_VERSES = 822

# Verse counts per chapter for 2 Chronicles (KJV standard)
CHAPTER_VERSE_COUNTS = {
    1: 17, 2: 18, 3: 17, 4: 22, 5: 14, 6: 42, 7: 22, 8: 18, 9: 31, 10: 19,
    11: 23, 12: 16, 13: 22, 14: 15, 15: 19, 16: 14, 17: 19, 18: 34, 19: 11, 20: 37,
    21: 20, 22: 12, 23: 21, 24: 27, 25: 28, 26: 23, 27: 9, 28: 27, 29: 36, 30: 27,
    31: 21, 32: 33, 33: 25, 34: 33, 35: 27, 36: 23
}

def has_strongs_numbers(text):
    """Check if text contains Strong's numbers like [H1234] or [G1234]"""
    pattern = r'\[(?:H|G)\d+\]'
    return bool(re.search(pattern, text))

def count_strongs_numbers(text):
    """Count Strong's numbers in text"""
    pattern = r'\[(?:H|G)\d+\]'
    return len(re.findall(pattern, text))

def validate_structure(data):
    """Validate the JSON structure"""
    errors = []
    warnings = []
    
    # Check top-level structure
    if 'book' not in data:
        errors.append("Missing 'book' field")
    elif data['book'] != '2 Chronicles':
        warnings.append(f"Book name is '{data['book']}', expected '2 Chronicles'")
    
    if 'chapters' not in data:
        errors.append("Missing 'chapters' field")
        return errors, warnings
    
    chapters = data['chapters']
    if not isinstance(chapters, list):
        errors.append("'chapters' must be a list")
        return errors, warnings
    
    if len(chapters) != EXPECTED_CHAPTERS:
        errors.append(f"Expected {EXPECTED_CHAPTERS} chapters, found {len(chapters)}")
    
    # Check each chapter
    total_verses = 0
    verses_with_strongs = 0
    verses_without_strongs = 0
    
    for i, chapter in enumerate(chapters, 1):
        if 'chapter' not in chapter:
            errors.append(f"Chapter {i}: Missing 'chapter' field")
            continue
        
        if str(chapter['chapter']) != str(i):
            warnings.append(f"Chapter {i}: chapter field is '{chapter['chapter']}', expected '{i}'")
        
        if 'verses' not in chapter:
            errors.append(f"Chapter {i}: Missing 'verses' field")
            continue
        
        verses = chapter['verses']
        if not isinstance(verses, list):
            errors.append(f"Chapter {i}: 'verses' must be a list")
            continue
        
        expected_verses = CHAPTER_VERSE_COUNTS.get(i, 0)
        if len(verses) != expected_verses:
            errors.append(f"Chapter {i}: Expected {expected_verses} verses, found {len(verses)}")
        
        total_verses += len(verses)
        
        # Check each verse
        for j, verse in enumerate(verses, 1):
            if 'verse' not in verse:
                errors.append(f"Chapter {i}, Verse {j}: Missing 'verse' field")
                continue
            
            if str(verse['verse']) != str(j):
                warnings.append(f"Chapter {i}, Verse {j}: verse field is '{verse['verse']}', expected '{j}'")
            
            if 'text' not in verse:
                errors.append(f"Chapter {i}, Verse {j}: Missing 'text' field")
                continue
            
            text = verse['text']
            if not text or not text.strip():
                errors.append(f"Chapter {i}, Verse {j}: Empty text")
                continue
            
            # Check for Strong's numbers
            if has_strongs_numbers(text):
                verses_with_strongs += 1
            else:
                verses_without_strongs += 1
    
    # Summary
    print(f"\n=== Validation Summary ===")
    print(f"Total chapters: {len(chapters)}")
    print(f"Total verses: {total_verses} (expected: {EXPECTED_VERSES})")
    print(f"Verses with Strong's numbers: {verses_with_strongs}")
    print(f"Verses without Strong's numbers: {verses_without_strongs}")
    
    if verses_with_strongs == 0:
        warnings.append("NO Strong's numbers found in any verse!")
    elif verses_without_strongs > 0:
        warnings.append(f"{verses_without_strongs} verses missing Strong's numbers")
    
    return errors, warnings

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 process_2chronicles_strongs.py input.json [output.json]")
        print("\nThis script validates a 2 Chronicles JSON file with Strong's numbers")
        print("and optionally copies it to the output location if valid.")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    
    if not input_file.exists():
        print(f"Error: Input file '{input_file}' not found")
        sys.exit(1)
    
    print(f"Loading {input_file}...")
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error loading file: {e}")
        sys.exit(1)
    
    print("Validating structure...")
    errors, warnings = validate_structure(data)
    
    # Print results
    if errors:
        print(f"\n❌ ERRORS ({len(errors)}):")
        for error in errors:
            print(f"  - {error}")
    
    if warnings:
        print(f"\n⚠️  WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"  - {warning}")
    
    if not errors and not warnings:
        print("\n✅ File is valid and has Strong's numbers!")
    elif not errors:
        print("\n✅ File structure is valid (but see warnings)")
    else:
        print("\n❌ File has structural errors")
        sys.exit(1)
    
    # Copy to output if specified and valid
    if output_file and not errors:
        print(f"\nCopying to {output_file}...")
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print("✅ Done!")
        except Exception as e:
            print(f"Error writing output: {e}")
            sys.exit(1)

if __name__ == '__main__':
    main()
