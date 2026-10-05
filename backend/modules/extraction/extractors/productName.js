/**
 * Extractor for Common or Generic Product Name.
 */

const PRODUCT_KEYWORD_REGEX = /(?:product|commodity|item)\s*(?:name)?[:.]?\s*([A-Za-z0-9\s-]+)/i;

export function extractProductName(lines = []) {
  // 1. Look for explicit "Product: XYZ" or "Commodity: XYZ" line
  for (const line of lines) {
    const match = line.text.match(PRODUCT_KEYWORD_REGEX);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 2) {
        return {
          name: 'productName',
          value: name,
          rawText: line.text,
          confidence: Number(((line.avgConfidence || 85) / 100).toFixed(2)),
          wordRefs: line.words,
        };
      }
    }
  }

  // 2. Fallback: Take top prominent line (largest glyph height or first line with letters)
  if (lines.length > 0) {
    // Filter out pure metadata lines (barcode, dates, mrp)
    const candidateLines = lines.filter((l) => {
      return !/mrp|mfd|exp|net\s*wt|fssai|batch/i.test(l.text) && l.text.length > 3;
    });

    if (candidateLines.length > 0) {
      // Pick line with maximum glyph height (title)
      const topTitleLine = candidateLines.reduce((prev, curr) => {
        return (curr.maxGlyphHeightPx || 0) > (prev.maxGlyphHeightPx || 0) ? curr : prev;
      }, candidateLines[0]);

      return {
        name: 'productName',
        value: topTitleLine.text.trim(),
        rawText: topTitleLine.text,
        confidence: 0.75,
        wordRefs: topTitleLine.words,
      };
    }
  }

  return null;
}

export default extractProductName;
