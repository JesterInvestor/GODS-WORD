# Styling Em Tags for Italics Display

## Current State

The Bible JSON files now contain `<em>` tags to mark words that should be italicized (words implied in English but not in original Hebrew/Greek). These tags are present in the HTML but not visually styled.

## What You See Now

In Genesis 1:2, the HTML shows:

```
and darkness <em>was</em> upon the face
```

But currently, "was" appears the same as other words because no CSS styling is applied to `<em>` tags.

## How to Add Italic Styling (Optional Enhancement)

If you want these words to display in italics like printed KJV Bibles, you have two options:

### Option 1: Global CSS (Simple)

Add to `app/globals.css`:

```css
/* Style italicized words in Bible text */
em {
  font-style: italic;
  font-weight: normal;
}
```

### Option 2: Scoped to Bible Text (Recommended)

Add to the Bible text container in `app/bible/page.tsx`:

```tsx
// In the verse text rendering section, add a class to style em tags
<style jsx>{`
  .bible-verse em {
    font-style: italic;
    font-weight: normal;
  }
`}</style>
```

Or using Tailwind CSS classes, update the verse paragraph to:

```tsx
<p className="text-lg mb-4 leading-relaxed [&>em]:italic">
  {renderTextWithStrongsLinks(verse.text, verseInfo)}
</p>
```

### Option 3: Keep as Plain Text (Current)

Leave as-is if you prefer all text to appear the same. The semantic `<em>` tags are still present in the HTML for:

- Accessibility
- Screen readers
- Future styling decisions
- Bible study reference

## Why Em Tags Matter

Even without visual styling, having `<em>` tags in the data is valuable because:

1. **Semantic HTML** - Properly marks which words are implied
2. **Accessibility** - Screen readers can emphasize these words differently
3. **Biblical Accuracy** - Matches printed KJV Bibles that use italics
4. **Strong's Concordance** - Helps distinguish original words from implied English
5. **Future Flexibility** - Easy to add styling later without changing data

## Examples of Italicized Words

Common cases where words are italicized in KJV:

- Helping verbs: "was", "were", "is", "are"
- Pronouns: "it", "he", "she"
- Articles: "a", "the"
- Possessives: "own"
- Conjunctions: "and", "that"

These are added by translators to make English grammar flow naturally, but have no direct equivalent in the Hebrew or Greek manuscripts.

## Testing

To see the effect of styling, you can:

1. Add temporary CSS to your browser's DevTools
2. Target `em` elements and set `font-style: italic`
3. Refresh the page to see italicized words throughout the Bible

---

_Note: This is an optional enhancement. The current implementation is complete and functional without additional styling._
