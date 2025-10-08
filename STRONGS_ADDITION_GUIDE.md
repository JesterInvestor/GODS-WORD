# Guide: Adding Strong's Concordance Numbers to 2 Chronicles

## Problem

The `public/data/2Chronicles.json` file currently contains accurate KJV text but lacks Strong's Concordance numbers. Other books in the repository (like 1Chronicles.json) include Strong's numbers embedded in the text format like:

```json
{
  "verse": "1",
  "text": "Adam,[H121] Sheth,[H8352] Enosh,[H583]"
}
```

But 2Chronicles currently has:

```json
{
  "verse": "1",
  "text": "And Solomon the son of David was strengthened in his kingdom..."
}
```

## Required Data Format

The 2 Chronicles JSON file needs to match this structure:

```json
{
  "book": "2 Chronicles",
  "chapters": [
    {
      "chapter": "1",
      "verses": [
        {
          "verse": "1",
          "text": "And Solomon[H8010] the son[H1121] of David[H1732] was strengthened[H2388] in his kingdom,[H4438] and the LORD[H3068] his God[H430] was with him, and magnified[H1431] him exceedingly.[H4605][H4605]"
        }
        // ... more verses
      ]
    }
    // ... more chapters
  ]
}
```

## Validation Requirements

- **Total chapters**: 36
- **Total verses**: 822
- **Verse counts per chapter**: See CHAPTER_VERSE_COUNTS in process_2chronicles_strongs.py
- **Strong's format**: `[H####]` for Hebrew, `[G####]` for Greek (mostly Hebrew for OT)
- **Encoding**: UTF-8
- **Book name**: "2 Chronicles"

## Data Sources (Recommended)

### Option 1: kaiserlik/kjv Repository (Preferred)
The repository at https://github.com/kaiserlik/kjv contains KJV Bible data with Strong's numbers. However, the exact file path for 2 Chronicles is unknown and needs to be located.

### Option 2: Manual Download and Processing
1. Visit one of these authoritative sources:
   - https://github.com/kaiserlik/kjv
   - https://github.com/openscriptures/strongs
   - https://getbible.net

2. Download 2 Chronicles data with Strong's numbers

3. Process the data to match the required JSON format

### Option 3: Use Existing Tools
If you have access to Bible software with Strong's numbers (e.g., e-Sword, The SWORD Project), you can:
1. Export 2 Chronicles in a format with Strong's numbers
2. Convert to the required JSON format using the processing script

## Processing Steps

Once you have a source file with Strong's numbers:

1. **Validate the input file**:
   ```bash
   python3 /tmp/process_2chronicles_strongs.py input_file.json
   ```

2. **If valid, copy to the repository**:
   ```bash
   python3 /tmp/process_2chronicles_strongs.py input_file.json public/data/2Chronicles.json
   ```

3. **Verify the application works**:
   ```bash
   npm run build
   npm run start
   ```

4. **Test Strong's numbers in the UI**:
   - Navigate to 2 Chronicles in the Bible reader
   - Enable Strong's numbers using the "S#" button
   - Click on words to see Strong's definitions

## Validation Script

A Python script has been created to validate 2 Chronicles JSON files:

Location: `/tmp/process_2chronicles_strongs.py`

Usage:
```bash
# Validate only
python3 process_2chronicles_strongs.py input.json

# Validate and copy to output
python3 process_2chronicles_strongs.py input.json output.json
```

The script checks:
- Correct JSON structure
- 36 chapters with correct verse counts
- Presence of Strong's numbers in format [H####] or [G####]
- UTF-8 encoding
- No empty verses

## Current Status

- ✅ Current 2Chronicles.json has correct structure (36 chapters, 822 verses)
- ✅ Correct verse counts per chapter
- ✅ Valid JSON format
- ✅ No empty verses
- ❌ **NO Strong's Concordance numbers**

## Network Access Issues

During this work, the following external resources were attempted but are currently blocked:

- github.com API (DNS blocked)
- raw.githubusercontent.com (404 or DNS blocked)
- getbible.net API (DNS blocked)
- bible-api.com (DNS blocked)
- labs.bible.org API (DNS blocked)
- npm packages (bible-kjv, node-sword-interface) - no Strong's numbers

## Next Steps

**Option A: Request Data Access**
If you have the ability to access external resources, please:
1. Download 2 Chronicles with Strong's numbers from kaiserlik/kjv or similar source
2. Provide the file for processing
3. We can then validate and integrate it

**Option B: Manual Integration**
If you have access to Bible software or databases with Strong's numbers:
1. Export 2 Chronicles text with Strong's numbers
2. Format as JSON matching the structure shown above
3. Use the validation script to verify
4. Replace the current file

**Option C: Request Network Access**
Grant temporary network access to download from authoritative Bible data sources.

## Related Files

- `public/data/2Chronicles.json` - Current file (no Strong's numbers)
- `public/data/1Chronicles.json` - Reference file (has Strong's numbers)
- `CHANGES.md` - Documents previous fixes including 2Chronicles
- `CORRUPTION_FIX_SUMMARY.md` - Notes about the Strong's numbers limitation

## Contact

If you need assistance or have questions about this process, please comment on the issue or PR.
