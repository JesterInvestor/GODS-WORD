#!/usr/bin/env python3
"""
Comprehensive Bible Book Verification Tool

This script verifies a Bible book JSON file for:
1. Text accuracy against a reference KJV source
2. Arrow symbols and special characters
3. Strong's number formatting
4. Punctuation consistency
5. Whitespace and formatting issues

Usage:
    python3 scripts/verify_bible_book.py <book_file> <reference_file>
    
Example:
    python3 scripts/verify_bible_book.py public/data/2Chronicles.json /tmp/Bible-kjv/2Chronicles.json
"""

import json
import re
import sys
from pathlib import Path


def normalize_text(text):
    """Remove Strong's numbers and em tags for comparison"""
    # Remove Strong's numbers like [H1234] or [G1234]
    text = re.sub(r'\[(?:H|G)\d+[A-Z]?\]', '', text)
    # Remove em tags
    text = re.sub(r'</?em>', '', text)
    # Normalize whitespace
    return ' '.join(text.split())


def verify_bible_book(book_file, reference_file):
    """Comprehensive verification of a Bible book file"""
    
    print("=" * 80)
    print("BIBLE BOOK VERIFICATION TOOL")
    print("=" * 80)
    print(f"\nBook file: {book_file}")
    print(f"Reference: {reference_file}")
    print()
    
    # Load files
    try:
        with open(book_file, 'r', encoding='utf-8') as f:
            book_data = json.load(f)
    except Exception as e:
        print(f"❌ ERROR: Cannot load book file: {e}")
        return False
    
    try:
        with open(reference_file, 'r', encoding='utf-8') as f:
            ref_data = json.load(f)
    except Exception as e:
        print(f"❌ ERROR: Cannot load reference file: {e}")
        return False
    
    issues = []
    total_verses = 0
    verses_with_strongs = 0
    
    # Arrow symbols to check
    arrow_chars = ['→', '←', '↑', '↓', '⇒', '⇐', '➜', '➔', '⟶', '⟵', '⟷', '⇄', '⇌', '↔']
    ascii_arrows = ['-->', '<--', '=>', '<=', '->', '<-']
    
    # Verify each verse
    for ch_idx, chapter in enumerate(book_data['chapters']):
        ch_num = chapter['chapter']
        
        if ch_idx >= len(ref_data['chapters']):
            issues.append(f"Chapter {ch_num}: Missing in reference")
            continue
        
        ref_chapter = ref_data['chapters'][ch_idx]
        
        for v_idx, verse in enumerate(chapter['verses']):
            verse_num = verse['verse']
            text = verse['text']
            total_verses += 1
            ref = f"{ch_num}:{verse_num}"
            
            # Count verses with Strong's numbers
            if '[H' in text or '[G' in text:
                verses_with_strongs += 1
            
            if v_idx >= len(ref_chapter['verses']):
                issues.append(f"{ref}: Missing in reference")
                continue
            
            ref_verse = ref_chapter['verses'][v_idx]
            ref_text = ref_verse['text']
            
            # Check 1: Arrow symbols
            for arrow in arrow_chars:
                if arrow in text:
                    issues.append(f"{ref}: ARROW FOUND: {arrow}")
            
            for arrow in ascii_arrows:
                if arrow in text:
                    issues.append(f"{ref}: ASCII ARROW: {arrow}")
            
            # Check 2: Text accuracy
            curr_norm = normalize_text(text)
            ref_norm = normalize_text(ref_text)
            if curr_norm != ref_norm:
                issues.append(f"{ref}: TEXT MISMATCH")
            
            # Check 3: Strong's number formatting
            valid_strongs = re.findall(r'\[(?:H|G)\d+[A-Z]?\]', text)
            all_brackets = re.findall(r'\[[^\]]*\]', text)
            
            for bracket in all_brackets:
                if bracket not in valid_strongs:
                    if '[H' in bracket or '[G' in bracket or '[h' in bracket or '[g' in bracket:
                        issues.append(f"{ref}: MALFORMED STRONG'S: {bracket}")
            
            # Check 4: Bracket matching
            open_count = text.count('[')
            close_count = text.count(']')
            if open_count != close_count:
                issues.append(f"{ref}: MISMATCHED BRACKETS: {open_count} [ vs {close_count} ]")
            
            # Check 5: Whitespace issues
            if '  ' in text:
                issues.append(f"{ref}: DOUBLE SPACE")
            if '\t' in text:
                issues.append(f"{ref}: TAB CHARACTER")
            if text != text.strip():
                issues.append(f"{ref}: LEADING/TRAILING WHITESPACE")
    
    # Print results
    print("=" * 80)
    print("VERIFICATION RESULTS")
    print("=" * 80)
    print(f"\nBook: {book_data.get('book', 'Unknown')}")
    print(f"Total chapters: {len(book_data['chapters'])}")
    print(f"Total verses: {total_verses}")
    print(f"Verses with Strong's numbers: {verses_with_strongs} ({verses_with_strongs*100//total_verses}%)")
    print(f"\nIssues found: {len(issues)}")
    
    if issues:
        print("\n" + "=" * 80)
        print("ISSUES FOUND:")
        print("=" * 80)
        for issue in issues[:100]:
            print(f"  {issue}")
        if len(issues) > 100:
            print(f"\n  ... and {len(issues) - 100} more issues")
        print("\n❌ VERIFICATION FAILED")
        return False
    else:
        print("\n" + "=" * 80)
        print("✅ ALL CHECKS PASSED!")
        print("=" * 80)
        print("\n✓ No arrows found")
        print("✓ Text matches KJV reference exactly")
        print("✓ All Strong's numbers properly formatted")
        print("✓ No bracket mismatches")
        print("✓ No whitespace issues")
        print("✓ File is ready for use")
        return True


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 verify_bible_book.py <book_file> <reference_file>")
        print("\nExample:")
        print("  python3 scripts/verify_bible_book.py public/data/2Chronicles.json /tmp/Bible-kjv/2Chronicles.json")
        sys.exit(1)
    
    book_file = sys.argv[1]
    reference_file = sys.argv[2]
    
    if not Path(book_file).exists():
        print(f"❌ ERROR: Book file not found: {book_file}")
        sys.exit(1)
    
    if not Path(reference_file).exists():
        print(f"❌ ERROR: Reference file not found: {reference_file}")
        sys.exit(1)
    
    success = verify_bible_book(book_file, reference_file)
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
