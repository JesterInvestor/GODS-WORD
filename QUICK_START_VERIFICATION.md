# Quick Start: Bible Data Verification

This guide shows how to quickly verify Bible data integrity or aggregate per-chapter files.

## Prerequisites

- Python 3.6 or higher (no external packages required)

## Common Use Cases

### 1. Verify Current Repository Data

Check that all 66 books are intact and properly formatted:

```bash
python3 scripts/aggregate_and_verify.py --verify-only --target public/data --output report.json
```

**Expected Output:**
```
=== Phase 2: Verifying book structures ===
✓ Genesis: OK
✓ Exodus: OK
...
✓ Revelation: OK

=== Summary ===
Books processed: 66
Books verified: 66
Structural verification issues: 0
```

### 2. Aggregate kenyonbowers Per-Chapter Files

If you have per-chapter files from kenyonbowers or another source:

```bash
# Step 1: Aggregate into book-level files
python3 scripts/aggregate_and_verify.py \
  --source /path/to/per-chapter-files \
  --target /tmp/aggregated \
  --output aggregation_report.json

# Step 2: Compare with current data
python3 scripts/aggregate_and_verify.py \
  --verify-only \
  --target /tmp/aggregated \
  --compare public/data \
  --output comparison_report.json
```

### 3. Test a Single Book

For testing or debugging:

```bash
python3 scripts/aggregate_and_verify.py \
  --verify-only \
  --target public/data \
  --book Genesis \
  --verbose
```

### 4. View Report Details

```bash
# Pretty print the JSON report
cat report.json | python3 -m json.tool

# View summary only
cat report.json | python3 -m json.tool | grep -A 10 "summary"

# Check for issues
cat report.json | python3 -m json.tool | grep -A 5 "issues"
```

## Understanding the Output

### ✓ Checkmark = Pass
- Book structure is correct
- Chapter count matches KJV standard
- All verses present

### ⚠ Warning = Issues Found
- Structural problems (missing chapters/verses)
- Encoding issues (invalid characters)
- Punctuation anomalies

### Summary Statistics
- **Books processed**: Total books checked
- **Verification issues**: Critical structural problems
- **Encoding issues**: Character encoding problems
- **Punctuation issues**: Potential formatting issues
- **Comparison differences**: Verses that differ between sources

## Common Scenarios

### Scenario 1: All Books Pass
```
Books processed: 66
Structural verification issues: 0
Encoding issues found: 0
```
✅ **Action:** No action needed, data is clean

### Scenario 2: Punctuation Issues Found
```
Punctuation issues found: 3
```
⚠ **Action:** Review report to see if they're legitimate (e.g., em dashes, ellipsis)

### Scenario 3: Structural Issues Found
```
Structural verification issues: 2
  - Mark: Expected 16 chapters, found 15
  - Genesis 1: No verses found
```
🚨 **Action:** Data corruption detected, needs manual review

### Scenario 4: Comparison Differences
```
Comparison differences: 150
```
⚠ **Action:** Review comparison report to see nature of differences

## Report Structure

The JSON report contains:

```json
{
  "aggregation": {},        // Results of file aggregation (if performed)
  "verification": {},       // Structural validation results per book
  "encoding_issues": {},    // Character encoding problems
  "punctuation_issues": {}, // Punctuation anomalies
  "comparison": {},         // Verse-by-verse differences (if --compare used)
  "summary": {}            // Overall statistics
}
```

## Supported Input Formats

### Per-Chapter File Naming
- `Genesis_1.json`, `Genesis_2.json`, ...
- `Genesis-1.json`, `Genesis-2.json`, ...
- `Genesis/1.json`, `Genesis/2.json`, ...

### Per-Chapter File Structure
```json
{
  "chapter": "1",
  "verses": [
    {"verse": "1", "text": "In the beginning..."}
  ]
}
```

Or simpler:
```json
[
  {"verse": "1", "text": "In the beginning..."}
]
```

## Troubleshooting

### "No chapter files found for BookName"
- Check file naming matches expected patterns
- Use `--verbose` to see what's being searched

### "Expected X chapters, found Y"
- Some chapter files may be missing
- Check for gaps in chapter numbers

### "JSON parse error"
- Input file has invalid JSON syntax
- Check file encoding (should be UTF-8)

### Script runs but no output file
- Check write permissions in output directory
- Verify output path is correct

## Advanced Usage

### Custom Output Location
```bash
python3 scripts/aggregate_and_verify.py \
  --verify-only \
  --target public/data \
  --output ~/Desktop/bible_report.json
```

### Only Aggregate (Skip Verification)
```bash
python3 scripts/aggregate_and_verify.py \
  --source /path/to/chapters \
  --target /path/to/output \
  --aggregate-only
```

### Verbose Mode (Detailed Progress)
```bash
python3 scripts/aggregate_and_verify.py \
  --verify-only \
  --target public/data \
  --verbose
```

## Getting Help

View all available options:
```bash
python3 scripts/aggregate_and_verify.py --help
```

See detailed documentation:
- `scripts/README.md` - Complete usage guide
- `AGGREGATION_AND_VERIFICATION.md` - Implementation details

## Current Repository Status

As of the last verification run:
- ✅ All 66 books present and valid
- ✅ All chapter counts correct
- ✅ No structural issues
- ✅ No encoding issues
- ✅ 1 harmless punctuation pattern flagged (Exodus 32:32)

**The repository data is in excellent condition.**
