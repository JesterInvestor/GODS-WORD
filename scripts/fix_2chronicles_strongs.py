#!/usr/bin/env python3
"""
Fix malformed Strong's references in 2Chronicles.json.
Removes suffix letters from Strong's numbers (e.g., H0001G -> H0001, H1121A -> H1121).
"""

import json
import re
import sys
from pathlib import Path

def fix_strongs_references(text):
    """Remove suffix letters and leading zeros from Strong's references in text.
    
    Converts [H0001G] to [H1], [H1121A] to [H1121], [H0430G] to [H430], etc.
    """
    # First remove suffix letters: [H0001G] -> [H0001]
    pattern1 = r'\[([HG]\d+)[A-Z]+\]'
    text = re.sub(pattern1, r'[\1]', text)
    
    # Then remove leading zeros: [H0001] -> [H1], [H0430] -> [H430]
    # This function handles the replacement
    def remove_leading_zeros(match):
        prefix = match.group(1)  # H or G
        number = match.group(2)  # The digits
        # Remove leading zeros but keep at least one digit
        number = number.lstrip('0') or '0'
        return f'[{prefix}{number}]'
    
    pattern2 = r'\[([HG])(\d+)\]'
    text = re.sub(pattern2, remove_leading_zeros, text)
    
    return text

def main():
    # Path to 2Chronicles.json
    chronicles_path = Path(__file__).parent.parent / 'public' / 'data' / '2Chronicles.json'
    
    if not chronicles_path.exists():
        print(f"Error: {chronicles_path} not found")
        sys.exit(1)
    
    print(f"Reading {chronicles_path}...")
    with open(chronicles_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Count issues before fix
    suffix_count = 0
    leading_zero_count = 0
    
    # Fix all verses
    for chapter in data.get('chapters', []):
        for verse in chapter.get('verses', []):
            text = verse.get('text', '')
            # Count malformed references with suffix letters
            suffix_count += len(re.findall(r'\[([HG]\d+)[A-Z]+\]', text))
            # Count references with leading zeros (e.g., H0001, H0430)
            leading_zero_count += len(re.findall(r'\[[HG]0\d+\]', text))
            # Fix the text
            verse['text'] = fix_strongs_references(text)
    
    # Count issues after fix (should be 0)
    suffix_after = 0
    leading_zero_after = 0
    for chapter in data.get('chapters', []):
        for verse in chapter.get('verses', []):
            text = verse.get('text', '')
            suffix_after += len(re.findall(r'\[([HG]\d+)[A-Z]+\]', text))
            leading_zero_after += len(re.findall(r'\[[HG]0\d+\]', text))
    
    print(f"Found and fixed {suffix_count} references with suffix letters")
    print(f"Found and fixed {leading_zero_count} references with leading zeros")
    print(f"Remaining suffix issues: {suffix_after}")
    print(f"Remaining leading zero issues: {leading_zero_after}")
    
    if suffix_count == 0 and leading_zero_count == 0:
        print("No issues found - file already correct")
        return
    
    # Write back to file
    print(f"Writing corrected data to {chronicles_path}...")
    with open(chronicles_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✓ Successfully fixed 2Chronicles.json")

if __name__ == '__main__':
    main()
