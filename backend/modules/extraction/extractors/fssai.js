/**
 * Extractor for 14-digit FSSAI license number.
 */

const FSSAI_KEYWORD_REGEX = /fssai|lic(?:ense)?\.?\s*no\.?/i;
const FSSAI_NUMBER_REGEX = /\b([12][0-9]{13})\b/;

export function extractFssai(lines = []) {
  for (const line of lines) {
    const text = line.text;
    const match = text.match(FSSAI_NUMBER_REGEX);

    if (match) {
      const hasKeyword = FSSAI_KEYWORD_REGEX.test(text);
      const wordRefs = line.words.filter((w) => w.text.includes(match[1]) || /fssai|lic/i.test(w.text));
      const baseConf = line.avgConfidence || 85;
      const confidence = hasKeyword ? Math.min(baseConf / 100, 0.98) : Math.min((baseConf * 0.85) / 100, 0.85);

      return {
        name: 'fssai',
        value: match[1],
        rawText: text,
        confidence: Number(confidence.toFixed(2)),
        wordRefs: wordRefs.length > 0 ? wordRefs : line.words,
      };
    }
  }

  return null;
}

export default extractFssai;
