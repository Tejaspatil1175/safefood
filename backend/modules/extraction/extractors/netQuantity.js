/**
 * Extractor for Net Quantity (value, unit, glyph word references).
 */

const UNIT_MAP = {
  g: 'g',
  gm: 'g',
  gms: 'g',
  gram: 'g',
  grams: 'g',
  kg: 'kg',
  kgs: 'kg',
  kilogram: 'kg',
  ml: 'ml',
  millilitre: 'ml',
  milliliter: 'ml',
  l: 'l',
  ltr: 'l',
  litre: 'l',
  liter: 'l',
  u: 'units',
  unit: 'units',
  units: 'units',
  n: 'number',
  nos: 'number',
  no: 'number',
};

// Pattern for quantity value + unit: e.g. "800g", "800 g", "1.5 kg", "1000ml", "500 mL"
const QTY_REGEX = /(?:net\s*(?:wt|weight|qty|quantity|volume|contents|mass)?[:.]?\s*)?([0-9]+(?:[.,][0-9]+)?)\s*(kg|kgs|g|gm|gms|grams|ml|ltr|litre|liter|l|units|unit|nos|no|u|n)\b/i;

export function extractNetQuantity(lines = []) {
  for (const line of lines) {
    const text = line.text;
    const match = text.match(QTY_REGEX);

    if (match) {
      const rawNumber = match[1].replace(',', '.');
      const val = parseFloat(rawNumber);
      const rawUnit = match[2].toLowerCase();
      const unit = UNIT_MAP[rawUnit] || rawUnit;

      if (!isNaN(val) && val > 0) {
        // Find matching wordRefs in line.words
        const wordRefs = line.words.filter((w) => {
          const wLower = w.text.toLowerCase();
          return (
            wLower.includes(match[1]) ||
            wLower.includes(rawUnit) ||
            wLower.includes('net') ||
            wLower.includes('wt') ||
            wLower.includes('qty')
          );
        });

        // Compute confidence based on OCR word confidence and keyword presence
        const hasKeyword = /net|wt|qty|weight|quantity|volume/i.test(text);
        const baseConf = line.avgConfidence || 85;
        const confidence = hasKeyword ? Math.min(baseConf / 100, 0.98) : Math.min((baseConf * 0.85) / 100, 0.85);

        return {
          name: 'netQuantity',
          value: {
            value: val,
            unit,
          },
          rawText: match[0],
          confidence: Number(confidence.toFixed(2)),
          wordRefs: wordRefs.length > 0 ? wordRefs : line.words,
        };
      }
    }
  }

  return null;
}

export default extractNetQuantity;
