# 2 Chronicles Strong's Numbers - Technical Analysis

## Problem Statement

The issue requests adding Strong's Concordance numbers to 2 Chronicles, specifically citing `@scrollmapper/bible_databases/files/formats/json/KJV.json` as the source.

## Investigation Findings

### 1. Source Verification: scrollmapper/bible_databases

**Repository:** https://github.com/scrollmapper/bible_databases

**Finding:** The `formats/json/KJV.json` file does **NOT** contain Strong's Concordance numbers embedded in the text field, despite the metadata description claiming "KJV: King James Version (1769) with Strongs Numbers and Morphology and CatchWords".

**Evidence:**

```json
{
  "verse": 1,
  "chapter": 1,
  "name": "II Chronicles 1:1",
  "text": "And Solomon the son of David was strengthened in his kingdom, and the Lord his God was with him, and magnified him exceedingly."
}
```

The text field contains plain KJV English without any Strong's numbers like `[H####]` or `[G####]`.

### 2. Alternative Sources Evaluated

#### STEPBible TAHOT (Translators Amalgamated Hebrew OT)

- **Location:** https://github.com/STEPBible/STEPBible-Data
- **File:** `Translators Amalgamated OT+NT/TAHOT Jos-Est - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt`
- **Format:** Tab-delimited with Hebrew text, transliteration, English gloss, and Strong's numbers
- **Challenge:** Word-by-word format requires sophisticated alignment with English KJV text due to:
  - Different word order between Hebrew and English
  - One-to-many and many-to-one word mappings
  - Grammatical particles vs. English function words

**Example TAHOT entry:**

```
2Ch.1.1#01=L	וַ/יִּתְחַזֵּ֛ק	va/i.yit.cha.Zek	and/ he strengthened himself	H9001/{H2388G}	Hc/Vtw3ms
2Ch.1.1#02=L	שְׁלֹמֹ֥ה	she.lo.Moh	Solomon	{H8010}	HNpm
```

#### Other Sources Investigated

- **openscriptures/morphhb:** Hebrew morphology but not aligned with English
- **getbible/v2:** API unavailable or incomplete
- **thiagobodruk/bible:** Plain KJV without Strong's numbers
- **Various Bible APIs:** Most either inaccessible or lacking Strong's integration

### 3. Current Repository Status

**1 Chronicles:** Contains Strong's numbers in the format `word[H####]`

```json
{
  "verse": "1",
  "text": "Adam,[H121] Sheth,[H8352] Enosh,[H583]"
}
```

**2 Chronicles:** Plain KJV text without Strong's numbers

```json
{
  "verse": "1",
  "text": "And Solomon the son of David was strengthened in his kingdom, and the LORD his God was with him, and magnified him exceedingly."
}
```

## Technical Challenges

### Word Alignment Complexity

Creating accurate word-aligned Strong's numbers from Hebrew sources requires:

1. **Morphological Analysis:** Understanding how Hebrew words map to English phrases
2. **Syntactic Parsing:** Handling word order differences
3. **Semantic Matching:** Determining which English words correspond to which Hebrew roots
4. **Manual Verification:** Quality control to ensure accuracy

Example of alignment difficulty:

- Hebrew: `וַ/יִּתְחַזֵּ֛ק שְׁלֹמֹ֥ה` (va/yitchazek Shlomo = "and strengthened Solomon")
- English: "And Solomon... was strengthened"
- The verb comes first in Hebrew but appears later in English

### Quality Concerns

Automated alignment without manual verification risks:

- Mismatched Strong's numbers
- Missing or duplicate annotations
- Theological inaccuracies
- User confusion

## Recommended Solutions

### Option 1: Use Pre-Aligned Source (RECOMMENDED)

Find or obtain a JSON Bible resource that already has professionally aligned KJV text with Strong's numbers for 2 Chronicles. Potential sources:

- Commercial Bible software exports (e-Sword, Logos, etc.)
- Academic biblical studies projects
- Professional Bible API services

### Option 2: Manual Curation

Manually add Strong's numbers using:

- Blue Letter Bible (blueletterbible.org)
- Strong's Concordance reference
- Comparison with 1 Chronicles pattern
- **Estimated effort:** 2-4 hours for 822 verses with spot-checking

### Option 3: Sophisticated NLP Pipeline

Develop a proper word alignment system:

1. Parse TAHOT Hebrew data
2. Implement Hebrew-English word alignment algorithms
3. Map English words to Hebrew Strong's numbers
4. Manual verification of results

- **Estimated effort:** 20-40 hours of development + testing

### Option 4: Leave as Documented Limitation

Update `CHANGES.md` to note that:

- 2 Chronicles was restored from authoritative KJV source (aruljohn/Bible-kjv)
- Strong's numbers unavailable due to lack of properly aligned source
- Future enhancement when suitable data source is identified

## Conclusion

The issue description's specified source (`@scrollmapper/bible_databases/files/formats/json/KJV.json`) does not contain Strong's numbers. Properly adding Strong's numbers to 2 Chronicles requires either:

1. Finding a pre-existing properly aligned source
2. Manual curation work
3. Significant NLP development effort

**Recommendation:** Pursue Option 1 or Option 2 for best balance of accuracy and effort.
