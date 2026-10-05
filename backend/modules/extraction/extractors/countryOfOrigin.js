/**
 * Extractor for Country of Origin.
 */

const ORIGIN_REGEX = /(?:country\s*of\s*origin|made\s*in|product\s*of)[:.]?\s*([A-Za-z\s]+?)(?:[.,;]|$)/i;

export function extractCountryOfOrigin(lines = []) {
  for (const line of lines) {
    const text = line.text;
    const match = text.match(ORIGIN_REGEX);

    if (match && match[1]) {
      const country = match[1].trim();
      const baseConf = line.avgConfidence || 85;

      return {
        name: 'countryOfOrigin',
        value: country,
        rawText: text,
        confidence: Number(((baseConf * 0.95) / 100).toFixed(2)),
        wordRefs: line.words,
      };
    }
  }

  return null;
}

export default extractCountryOfOrigin;
