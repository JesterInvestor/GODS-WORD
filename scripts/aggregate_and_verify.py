#!/usr/bin/env python3
"""
Bible Data Aggregation and Verification Script

This script:
1. Aggregates per-chapter JSON files into book-level JSON files
2. Performs per-verse diff comparison between sources
3. Checks for punctuation and encoding issues
4. Generates comprehensive verification reports

Usage:
    python3 aggregate_and_verify.py --source <source_dir> --target <target_dir>
    python3 aggregate_and_verify.py --verify-only --target public/data
"""

import json
import os
import sys
import argparse
import re
from pathlib import Path
from typing import Dict, List, Tuple, Any
from collections import defaultdict
import difflib

# Standard KJV chapter counts for verification
KJV_CHAPTER_COUNTS = {
    "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
    "Joshua": 24, "Judges": 21, "Ruth": 4, "1Samuel": 31, "2Samuel": 24,
    "1Kings": 22, "2Kings": 25, "1Chronicles": 29, "2Chronicles": 36, "Ezra": 10,
    "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31,
    "Ecclesiastes": 12, "SongofSolomon": 8, "Isaiah": 66, "Jeremiah": 52,
    "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14, "Joel": 3,
    "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3,
    "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4,
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16,
    "1Corinthians": 16, "2Corinthians": 13, "Galatians": 6, "Ephesians": 6,
    "Philippians": 4, "Colossians": 4, "1Thessalonians": 5, "2Thessalonians": 3,
    "1Timothy": 6, "2Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13,
    "James": 5, "1Peter": 5, "2Peter": 3, "1John": 5, "2John": 1, "3John": 1,
    "Jude": 1, "Revelation": 22
}


class BibleVerifier:
    """Handles Bible data verification and comparison"""
    
    def __init__(self, verbose=False):
        self.verbose = verbose
        self.issues = defaultdict(list)
        
    def log(self, message):
        """Print message if verbose mode is enabled"""
        if self.verbose:
            print(message)
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison by removing Strong's numbers and extra whitespace"""
        # Remove Strong's numbers like [H430] or [G2316]
        text = re.sub(r'\[H\d+\]|\[G\d+\]', '', text)
        # Remove em tags
        text = re.sub(r'<em>|</em>', '', text)
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def check_encoding(self, text: str) -> List[str]:
        """Check for encoding issues in text"""
        issues = []
        
        # Check for common encoding problems
        problematic_chars = ['�', '\ufffd']  # Replacement character
        for char in problematic_chars:
            if char in text:
                issues.append(f"Encoding issue: replacement character '{char}' found")
        
        # Check for unexpected control characters
        control_chars = [c for c in text if ord(c) < 32 and c not in '\n\r\t']
        if control_chars:
            issues.append(f"Control characters found: {[ord(c) for c in control_chars]}")
        
        # Check for valid UTF-8 encoding
        try:
            text.encode('utf-8')
        except UnicodeEncodeError as e:
            issues.append(f"UTF-8 encoding error: {e}")
        
        return issues
    
    def check_punctuation(self, text: str) -> List[str]:
        """Check for punctuation issues"""
        issues = []
        
        # Check for double punctuation (but allow ... and !! and ?)
        if re.search(r'\.{4,}|[?!,;:]{2,}', text):
            issues.append("Unusual punctuation pattern")
        
        # Check for space before punctuation (common OCR error)
        if re.search(r'\s+[.,;:]', text):
            issues.append("Space before punctuation")
        
        # Check for missing space after sentence-ending punctuation
        if re.search(r'[.?!][A-Z]', text):
            issues.append("Missing space after sentence-ending punctuation")
        
        return issues
    
    def compare_verses(self, verse1: Dict, verse2: Dict, book: str, chapter: str, verse: str) -> Dict:
        """Compare two verse objects and return differences"""
        result = {
            "book": book,
            "chapter": chapter,
            "verse": verse,
            "identical": True,
            "differences": []
        }
        
        text1 = verse1.get("text", "")
        text2 = verse2.get("text", "")
        
        # Exact comparison first
        if text1 == text2:
            return result
        
        result["identical"] = False
        
        # Normalized comparison
        norm1 = self.normalize_text(text1)
        norm2 = self.normalize_text(text2)
        
        if norm1 == norm2:
            result["differences"].append("Only Strong's numbers or formatting differ")
        else:
            # Calculate similarity
            similarity = difflib.SequenceMatcher(None, norm1, norm2).ratio()
            result["similarity"] = similarity
            
            if similarity < 0.9:
                result["differences"].append(f"Significant text difference (similarity: {similarity:.2%})")
                result["text1"] = text1[:100] + "..." if len(text1) > 100 else text1
                result["text2"] = text2[:100] + "..." if len(text2) > 100 else text2
            else:
                result["differences"].append("Minor text differences")
        
        return result


class BookAggregator:
    """Aggregates per-chapter files into book-level JSON"""
    
    def __init__(self, source_dir: str, verbose=False):
        self.source_dir = Path(source_dir)
        self.verbose = verbose
        
    def log(self, message):
        """Print message if verbose mode is enabled"""
        if self.verbose:
            print(message)
    
    def find_chapter_files(self, book_name: str) -> List[Path]:
        """Find all chapter files for a given book"""
        # Look for patterns like: Genesis_1.json, Genesis_01.json, Genesis-1.json, etc.
        patterns = [
            f"{book_name}_*.json",
            f"{book_name}-*.json",
            f"{book_name}/*.json",
            f"{book_name.lower()}_*.json",
            f"{book_name.lower()}-*.json",
            f"{book_name.lower()}/*.json"
        ]
        
        chapter_files = []
        for pattern in patterns:
            chapter_files.extend(self.source_dir.glob(pattern))
        
        # Also check subdirectories
        book_dir = self.source_dir / book_name
        if book_dir.exists() and book_dir.is_dir():
            chapter_files.extend(book_dir.glob("*.json"))
        
        return list(set(chapter_files))  # Remove duplicates
    
    def extract_chapter_number(self, filename: str) -> int:
        """Extract chapter number from filename"""
        # Try to find a number in the filename
        match = re.search(r'[\-_](\d+)\.json$', filename)
        if match:
            return int(match.group(1))
        # Try to find just a number
        match = re.search(r'(\d+)\.json$', filename)
        if match:
            return int(match.group(1))
        return 0
    
    def aggregate_book(self, book_name: str) -> Dict:
        """Aggregate all chapters for a book into a single JSON structure"""
        self.log(f"Aggregating {book_name}...")
        
        chapter_files = self.find_chapter_files(book_name)
        if not chapter_files:
            self.log(f"  No chapter files found for {book_name}")
            return None
        
        self.log(f"  Found {len(chapter_files)} chapter files")
        
        # Sort by chapter number
        chapter_files.sort(key=lambda f: self.extract_chapter_number(f.name))
        
        book_data = {
            "book": book_name,
            "chapters": []
        }
        
        for chapter_file in chapter_files:
            try:
                with open(chapter_file, 'r', encoding='utf-8') as f:
                    chapter_data = json.load(f)
                
                # Handle different input formats
                if isinstance(chapter_data, dict):
                    # If the file already has chapter structure
                    if "chapter" in chapter_data and "verses" in chapter_data:
                        book_data["chapters"].append(chapter_data)
                    # If it's just a list of verses
                    elif "verses" in chapter_data:
                        chapter_num = self.extract_chapter_number(chapter_file.name)
                        book_data["chapters"].append({
                            "chapter": str(chapter_num),
                            "verses": chapter_data["verses"]
                        })
                elif isinstance(chapter_data, list):
                    # If the file is just an array of verses
                    chapter_num = self.extract_chapter_number(chapter_file.name)
                    book_data["chapters"].append({
                        "chapter": str(chapter_num),
                        "verses": chapter_data
                    })
                    
            except json.JSONDecodeError as e:
                self.log(f"  Error parsing {chapter_file.name}: {e}")
                continue
            except Exception as e:
                self.log(f"  Error reading {chapter_file.name}: {e}")
                continue
        
        if not book_data["chapters"]:
            return None
        
        # Sort chapters by number
        book_data["chapters"].sort(key=lambda c: int(c.get("chapter", "0")))
        
        return book_data


def load_book_json(filepath: Path) -> Dict:
    """Load a book-level JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None


def verify_book_structure(book_data: Dict, book_name: str) -> List[str]:
    """Verify that book has correct structure and chapter/verse counts"""
    issues = []
    
    if not book_data:
        issues.append(f"{book_name}: Failed to load book data")
        return issues
    
    # Check expected chapter count
    if book_name in KJV_CHAPTER_COUNTS:
        expected_chapters = KJV_CHAPTER_COUNTS[book_name]
        actual_chapters = len(book_data.get("chapters", []))
        if actual_chapters != expected_chapters:
            issues.append(f"{book_name}: Expected {expected_chapters} chapters, found {actual_chapters}")
    
    # Check each chapter has verses
    for chapter in book_data.get("chapters", []):
        chapter_num = chapter.get("chapter", "?")
        verses = chapter.get("verses", [])
        if not verses:
            issues.append(f"{book_name} {chapter_num}: No verses found")
        
        # Check for empty verse text
        for verse in verses:
            if not verse.get("text", "").strip():
                verse_num = verse.get("verse", "?")
                issues.append(f"{book_name} {chapter_num}:{verse_num}: Empty verse text")
    
    return issues


def main():
    parser = argparse.ArgumentParser(description="Aggregate and verify Bible JSON data")
    parser.add_argument("--source", help="Source directory containing per-chapter files")
    parser.add_argument("--target", default="public/data", help="Target directory for book-level files")
    parser.add_argument("--compare", help="Directory to compare against (optional)")
    parser.add_argument("--output", default="verification_report.json", help="Output report file")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    parser.add_argument("--book", help="Process only a specific book (for testing)")
    parser.add_argument("--aggregate-only", action="store_true", help="Only aggregate, skip verification")
    parser.add_argument("--verify-only", action="store_true", help="Only verify existing files, skip aggregation")
    
    args = parser.parse_args()
    
    verifier = BibleVerifier(verbose=args.verbose)
    report = {
        "aggregation": {},
        "verification": {},
        "comparison": {},
        "encoding_issues": {},
        "punctuation_issues": {},
        "summary": {}
    }
    
    # Determine which books to process
    books_to_process = [args.book] if args.book else list(KJV_CHAPTER_COUNTS.keys())
    
    # Phase 1: Aggregation
    if args.source and not args.verify_only:
        print("=== Phase 1: Aggregating per-chapter files ===")
        aggregator = BookAggregator(args.source, verbose=args.verbose)
        target_dir = Path(args.target)
        target_dir.mkdir(parents=True, exist_ok=True)
        
        for book_name in books_to_process:
            book_data = aggregator.aggregate_book(book_name)
            if book_data:
                output_file = target_dir / f"{book_name}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(book_data, f, indent=2, ensure_ascii=False)
                
                chapter_count = len(book_data["chapters"])
                verse_count = sum(len(ch["verses"]) for ch in book_data["chapters"])
                print(f"✓ {book_name}: {chapter_count} chapters, {verse_count} verses")
                report["aggregation"][book_name] = {
                    "status": "success",
                    "chapters": chapter_count,
                    "verses": verse_count
                }
            else:
                print(f"✗ {book_name}: No data found")
                report["aggregation"][book_name] = {"status": "failed", "reason": "no data found"}
    
    if args.aggregate_only:
        print("\n=== Aggregation Complete ===")
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        return
    
    # Phase 2: Verification
    print("\n=== Phase 2: Verifying book structures ===")
    target_dir = Path(args.target)
    all_issues = []
    total_encoding_issues = 0
    total_punctuation_issues = 0
    
    for book_name in books_to_process:
        book_file = target_dir / f"{book_name}.json"
        if not book_file.exists():
            print(f"⚠ {book_name}: File not found")
            continue
        
        book_data = load_book_json(book_file)
        issues = verify_book_structure(book_data, book_name)
        
        if issues:
            print(f"⚠ {book_name}:")
            for issue in issues:
                print(f"  - {issue}")
            all_issues.extend(issues)
            report["verification"][book_name] = {"status": "issues", "issues": issues}
        else:
            print(f"✓ {book_name}: OK")
            report["verification"][book_name] = {"status": "ok"}
        
        # Check encoding and punctuation for each verse
        encoding_issues = []
        punctuation_issues = []
        
        for chapter in book_data.get("chapters", []):
            chapter_num = chapter.get("chapter", "?")
            for verse in chapter.get("verses", []):
                verse_num = verse.get("verse", "?")
                text = verse.get("text", "")
                
                enc_issues = verifier.check_encoding(text)
                if enc_issues:
                    encoding_issues.append({
                        "reference": f"{book_name} {chapter_num}:{verse_num}",
                        "issues": enc_issues
                    })
                
                punct_issues = verifier.check_punctuation(text)
                if punct_issues:
                    punctuation_issues.append({
                        "reference": f"{book_name} {chapter_num}:{verse_num}",
                        "issues": punct_issues
                    })
        
        if encoding_issues:
            print(f"  Encoding issues: {len(encoding_issues)}")
            report["encoding_issues"][book_name] = encoding_issues[:10]  # First 10
            total_encoding_issues += len(encoding_issues)
        
        if punctuation_issues:
            print(f"  Punctuation issues: {len(punctuation_issues)}")
            report["punctuation_issues"][book_name] = punctuation_issues[:10]  # First 10
            total_punctuation_issues += len(punctuation_issues)
    
    # Phase 3: Comparison (if compare directory provided)
    if args.compare:
        print("\n=== Phase 3: Comparing with reference data ===")
        compare_dir = Path(args.compare)
        differences_found = 0
        
        for book_name in books_to_process:
            target_file = target_dir / f"{book_name}.json"
            compare_file = compare_dir / f"{book_name}.json"
            
            if not target_file.exists():
                continue
                
            if not compare_file.exists():
                print(f"⚠ {book_name}: No comparison file found")
                continue
            
            target_data = load_book_json(target_file)
            compare_data = load_book_json(compare_file)
            
            if not target_data or not compare_data:
                continue
            
            book_diffs = []
            
            # Compare each verse
            for ch_idx, chapter in enumerate(target_data.get("chapters", [])):
                if ch_idx >= len(compare_data.get("chapters", [])):
                    book_diffs.append({
                        "issue": f"Chapter {ch_idx + 1} exists in target but not in comparison"
                    })
                    break
                
                compare_chapter = compare_data["chapters"][ch_idx]
                chapter_num = chapter.get("chapter", "?")
                
                for v_idx, verse in enumerate(chapter.get("verses", [])):
                    if v_idx >= len(compare_chapter.get("verses", [])):
                        book_diffs.append({
                            "issue": f"Verse {chapter_num}:{v_idx + 1} exists in target but not in comparison"
                        })
                        break
                    
                    compare_verse = compare_chapter["verses"][v_idx]
                    verse_num = verse.get("verse", "?")
                    
                    diff = verifier.compare_verses(verse, compare_verse, book_name, chapter_num, verse_num)
                    if not diff["identical"]:
                        book_diffs.append(diff)
                        differences_found += 1
            
            if book_diffs:
                print(f"⚠ {book_name}: {len(book_diffs)} differences found")
                report["comparison"][book_name] = {
                    "differences": len(book_diffs),
                    "samples": book_diffs[:5]  # First 5 differences
                }
            else:
                print(f"✓ {book_name}: All verses match")
                report["comparison"][book_name] = {"differences": 0}
    
    # Generate summary
    report["summary"] = {
        "books_processed": len(books_to_process),
        "books_verified": sum(1 for book_name in books_to_process if (target_dir / f"{book_name}.json").exists()),
        "aggregation_successful": sum(1 for v in report["aggregation"].values() if v.get("status") == "success"),
        "verification_issues": len(all_issues),
        "encoding_issues_total": total_encoding_issues,
        "punctuation_issues_total": total_punctuation_issues,
        "comparison_differences": sum(v.get("differences", 0) for v in report["comparison"].values())
    }
    
    # Save report
    output_path = Path(args.output)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== Summary ===")
    print(f"Books processed: {report['summary']['books_processed']}")
    print(f"Books verified: {report['summary']['books_verified']}")
    if report["aggregation"]:
        print(f"Aggregation successful: {report['summary']['aggregation_successful']}")
    print(f"Structural verification issues: {report['summary']['verification_issues']}")
    print(f"Encoding issues found: {report['summary']['encoding_issues_total']}")
    print(f"Punctuation issues found: {report['summary']['punctuation_issues_total']}")
    if report["comparison"]:
        print(f"Comparison differences: {report['summary']['comparison_differences']}")
    print(f"\nDetailed report saved to: {args.output}")
    
    # Return exit code based on critical issues
    if report['summary']['verification_issues'] > 0:
        print("\n⚠ Critical structural issues found!")
        sys.exit(1)


if __name__ == "__main__":
    main()
