# Bible Data Aggregation and Verification Scripts

This directory contains scripts for aggregating per-chapter Bible JSON files into book-level JSON files and performing comprehensive verification checks.

## Scripts Overview

### aggregate_and_verify.py

Main script for aggregation, verification, and comparison.

### format_report.py

Formats JSON verification reports into human-readable text.

**Usage:**
```bash
python3 scripts/format_report.py report.json
python3 scripts/format_report.py report.json --output report.txt
```

---

## aggregate_and_verify.py

A comprehensive Python script that handles:
1. **Aggregation**: Combines per-chapter JSON files into book-level JSON files
2. **Verification**: Validates structure, chapter counts, and verse counts
3. **Encoding Checks**: Detects encoding issues and invalid characters
4. **Punctuation Checks**: Identifies punctuation anomalies
5. **Comparison**: Performs per-verse diff between two data sources

### Requirements

- Python 3.6 or higher
- No external dependencies (uses only standard library)

### Usage

#### Verify Existing Data

Check the integrity of existing book-level JSON files:

```bash
python3 scripts/aggregate_and_verify.py --verify-only --target public/data --output verification_report.json
```

#### Aggregate Per-Chapter Files

If you have per-chapter files (e.g., from kenyonbowers or another source), aggregate them into book-level files:

```bash
python3 scripts/aggregate_and_verify.py \
  --source path/to/per-chapter-files \
  --target public/data \
  --output aggregation_report.json
```

#### Compare Two Data Sources

Compare aggregated data with existing data to find differences:

```bash
python3 scripts/aggregate_and_verify.py \
  --source path/to/new-data \
  --target public/data \
  --compare public/data \
  --output comparison_report.json
```

#### Process a Single Book (for testing)

```bash
python3 scripts/aggregate_and_verify.py \
  --verify-only \
  --target public/data \
  --book Genesis \
  --verbose
```

### Command-Line Options

| Option | Description |
|--------|-------------|
| `--source DIR` | Source directory containing per-chapter JSON files |
| `--target DIR` | Target directory for book-level JSON files (default: `public/data`) |
| `--compare DIR` | Directory to compare against (for per-verse diff) |
| `--output FILE` | Output report file (default: `verification_report.json`) |
| `--book NAME` | Process only a specific book (e.g., `Genesis`) |
| `--verbose` | Enable verbose output |
| `--aggregate-only` | Only perform aggregation, skip verification |
| `--verify-only` | Only verify existing files, skip aggregation |

### Input File Formats

The script supports multiple per-chapter file naming conventions:

- `BookName_1.json`, `BookName_2.json`, etc.
- `BookName-1.json`, `BookName-2.json`, etc.
- `BookName/1.json`, `BookName/2.json`, etc. (subdirectory structure)
- `bookname_1.json` (lowercase)

Each per-chapter file can have one of these formats:

**Format 1: Chapter object with verses array**
```json
{
  "chapter": "1",
  "verses": [
    {"verse": "1", "text": "In the beginning..."},
    {"verse": "2", "text": "And the earth was..."}
  ]
}
```

**Format 2: Object with verses property**
```json
{
  "verses": [
    {"verse": "1", "text": "In the beginning..."},
    {"verse": "2", "text": "And the earth was..."}
  ]
}
```

**Format 3: Array of verses**
```json
[
  {"verse": "1", "text": "In the beginning..."},
  {"verse": "2", "text": "And the earth was..."}
]
```

### Output Format

The script generates a comprehensive JSON report with the following structure:

```json
{
  "aggregation": {
    "BookName": {
      "status": "success",
      "chapters": 50,
      "verses": 1533
    }
  },
  "verification": {
    "BookName": {
      "status": "ok"
    }
  },
  "encoding_issues": {
    "BookName": [
      {
        "reference": "BookName 1:1",
        "issues": ["Encoding issue description"]
      }
    ]
  },
  "punctuation_issues": {
    "BookName": [
      {
        "reference": "BookName 1:1", 
        "issues": ["Punctuation issue description"]
      }
    ]
  },
  "comparison": {
    "BookName": {
      "differences": 5,
      "samples": [
        {
          "book": "BookName",
          "chapter": "1",
          "verse": "1",
          "identical": false,
          "differences": ["Minor text differences"],
          "similarity": 0.95
        }
      ]
    }
  },
  "summary": {
    "books_processed": 66,
    "books_verified": 66,
    "verification_issues": 0,
    "encoding_issues_total": 0,
    "punctuation_issues_total": 1,
    "comparison_differences": 0
  }
}
```

### Verification Checks Performed

1. **Structural Validation**
   - Valid JSON format
   - Correct number of chapters per book (compared to KJV standard)
   - All chapters have verse arrays
   - No empty verse text

2. **Encoding Checks**
   - Unicode replacement characters (�)
   - Invalid control characters
   - UTF-8 encoding validity

3. **Punctuation Checks**
   - Unusual punctuation patterns (excessive repetition)
   - Spaces before punctuation
   - Missing spaces after sentence-ending punctuation

4. **Text Comparison** (when `--compare` is used)
   - Exact text matching
   - Normalized text matching (ignoring Strong's numbers and formatting)
   - Similarity scoring using sequence matching
   - Per-verse diff reporting

### Example Workflow: kenyonbowers Integration

If you have per-chapter files from the kenyonbowers repository:

1. **Clone or download the kenyonbowers data** to a local directory
2. **Aggregate the files** into book-level JSON:
   ```bash
   python3 scripts/aggregate_and_verify.py \
     --source /path/to/kenyonbowers/data \
     --target /tmp/aggregated_books \
     --output aggregation_report.json
   ```
3. **Compare with existing data**:
   ```bash
   python3 scripts/aggregate_and_verify.py \
     --verify-only \
     --target /tmp/aggregated_books \
     --compare public/data \
     --output comparison_report.json
   ```
4. **Review the reports** to identify any differences
5. **Merge or replace files** as needed based on the comparison

### KJV Standard Chapter Counts

The script validates against standard KJV chapter counts for all 66 books:

- Old Testament: 39 books (Genesis through Malachi)
- New Testament: 27 books (Matthew through Revelation)

### Exit Codes

- `0`: Success (no critical issues found)
- `1`: Critical structural issues found (missing chapters, empty verses, etc.)

### Troubleshooting

**"No chapter files found for BookName"**
- Check that your source directory contains files matching the expected naming patterns
- Use `--verbose` to see which files are being found

**"Expected X chapters, found Y"**
- Verify all chapter files are present in the source directory
- Check for missing or duplicate chapter numbers

**"JSON parse error"**
- Ensure all input files are valid JSON
- Check file encoding (should be UTF-8)

### Notes

- The script normalizes text by removing Strong's numbers (e.g., `[H430]`, `[G2316]`) and `<em>` tags for comparison
- Punctuation checks may flag legitimate patterns (e.g., ellipsis "..." or em dashes)
- All output files use UTF-8 encoding with proper Unicode support
- The script is designed to be idempotent - you can run it multiple times safely
