#!/usr/bin/env python3
"""
Format verification report JSON into human-readable text

Usage:
    python3 format_report.py report.json
    python3 format_report.py report.json --output report.txt
"""

import json
import sys
import argparse
from pathlib import Path


def format_report(report_data):
    """Format JSON report into human-readable text"""
    
    lines = []
    lines.append("=" * 70)
    lines.append("BIBLE DATA VERIFICATION REPORT")
    lines.append("=" * 70)
    lines.append("")
    
    # Summary Section
    summary = report_data.get("summary", {})
    lines.append("SUMMARY")
    lines.append("-" * 70)
    lines.append(f"Books Processed:           {summary.get('books_processed', 0)}")
    lines.append(f"Books Verified:            {summary.get('books_verified', 0)}")
    
    if 'aggregation_successful' in summary:
        lines.append(f"Aggregation Successful:    {summary.get('aggregation_successful', 0)}")
    
    lines.append(f"Structural Issues:         {summary.get('verification_issues', 0)}")
    lines.append(f"Encoding Issues:           {summary.get('encoding_issues_total', 0)}")
    lines.append(f"Punctuation Issues:        {summary.get('punctuation_issues_total', 0)}")
    
    if 'comparison_differences' in summary:
        lines.append(f"Comparison Differences:    {summary.get('comparison_differences', 0)}")
    
    lines.append("")
    
    # Aggregation Section
    aggregation = report_data.get("aggregation", {})
    if aggregation:
        lines.append("AGGREGATION RESULTS")
        lines.append("-" * 70)
        
        successful = []
        failed = []
        
        for book, data in aggregation.items():
            if data.get("status") == "success":
                chapters = data.get("chapters", 0)
                verses = data.get("verses", 0)
                successful.append(f"  ✓ {book:20} {chapters:3} chapters, {verses:5} verses")
            else:
                reason = data.get("reason", "unknown")
                failed.append(f"  ✗ {book:20} Failed: {reason}")
        
        if successful:
            lines.append(f"\nSuccessful ({len(successful)} books):")
            lines.extend(successful)
        
        if failed:
            lines.append(f"\nFailed ({len(failed)} books):")
            lines.extend(failed)
        
        lines.append("")
    
    # Verification Section
    verification = report_data.get("verification", {})
    if verification:
        lines.append("STRUCTURAL VERIFICATION")
        lines.append("-" * 70)
        
        issues_found = []
        ok_count = 0
        
        for book, data in verification.items():
            if data.get("status") == "ok":
                ok_count += 1
            elif data.get("status") == "issues":
                issues_found.append(f"\n⚠ {book}:")
                for issue in data.get("issues", []):
                    issues_found.append(f"  - {issue}")
        
        lines.append(f"Books with no issues: {ok_count}/{len(verification)}")
        
        if issues_found:
            lines.append("\nIssues Found:")
            lines.extend(issues_found)
        else:
            lines.append("✓ All books have correct structure")
        
        lines.append("")
    
    # Encoding Issues
    encoding_issues = report_data.get("encoding_issues", {})
    if encoding_issues:
        lines.append("ENCODING ISSUES")
        lines.append("-" * 70)
        
        total = 0
        for book, issues in encoding_issues.items():
            lines.append(f"\n{book}: {len(issues)} issue(s)")
            for issue in issues[:5]:  # Show first 5
                ref = issue.get("reference", "?")
                problems = ", ".join(issue.get("issues", []))
                lines.append(f"  {ref}: {problems}")
            
            if len(issues) > 5:
                lines.append(f"  ... and {len(issues) - 5} more")
            total += len(issues)
        
        lines.append(f"\nTotal encoding issues: {total}")
        lines.append("")
    
    # Punctuation Issues
    punctuation_issues = report_data.get("punctuation_issues", {})
    if punctuation_issues:
        lines.append("PUNCTUATION ISSUES")
        lines.append("-" * 70)
        
        total = 0
        for book, issues in punctuation_issues.items():
            lines.append(f"\n{book}: {len(issues)} issue(s)")
            for issue in issues[:5]:  # Show first 5
                ref = issue.get("reference", "?")
                problems = ", ".join(issue.get("issues", []))
                lines.append(f"  {ref}: {problems}")
            
            if len(issues) > 5:
                lines.append(f"  ... and {len(issues) - 5} more")
            total += len(issues)
        
        lines.append(f"\nTotal punctuation issues: {total}")
        lines.append("")
    
    # Comparison Section
    comparison = report_data.get("comparison", {})
    if comparison:
        lines.append("COMPARISON RESULTS")
        lines.append("-" * 70)
        
        books_with_diffs = []
        books_matched = []
        total_diffs = 0
        
        for book, data in comparison.items():
            diff_count = data.get("differences", 0)
            if diff_count > 0:
                books_with_diffs.append(f"  ⚠ {book:20} {diff_count:5} differences")
                total_diffs += diff_count
                
                # Show samples
                samples = data.get("samples", [])
                if samples:
                    for sample in samples[:3]:  # First 3 samples
                        ref = f"{sample.get('book')} {sample.get('chapter')}:{sample.get('verse')}"
                        diffs = ", ".join(sample.get("differences", []))
                        lines.append(f"    {ref}: {diffs}")
                        
                        if "text1" in sample:
                            lines.append(f"      Text 1: {sample['text1']}")
                        if "text2" in sample:
                            lines.append(f"      Text 2: {sample['text2']}")
            else:
                books_matched.append(book)
        
        lines.append(f"Books with no differences: {len(books_matched)}/{len(comparison)}")
        
        if books_with_diffs:
            lines.append(f"\nBooks with differences ({len(books_with_diffs)}):")
            lines.extend(books_with_diffs)
            lines.append(f"\nTotal differences: {total_diffs}")
        else:
            lines.append("✓ All verses match exactly")
        
        lines.append("")
    
    # Footer
    lines.append("=" * 70)
    lines.append("END OF REPORT")
    lines.append("=" * 70)
    
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Format verification report JSON")
    parser.add_argument("report", help="Path to JSON report file")
    parser.add_argument("--output", help="Output text file (default: print to console)")
    
    args = parser.parse_args()
    
    # Load JSON report
    try:
        with open(args.report, 'r', encoding='utf-8') as f:
            report_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Report file '{args.report}' not found", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in report file: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Format report
    formatted = format_report(report_data)
    
    # Output
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(formatted)
        print(f"Report saved to: {args.output}")
    else:
        print(formatted)


if __name__ == "__main__":
    main()
