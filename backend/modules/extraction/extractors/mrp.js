/**
 * Extractor for Maximum Retail Price (MRP).
 */

const MRP_REGEX = /(?:m\.?r\.?p\.?|max(?:imum)?\s*retail\s*price)?[:.]?\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:[.,][0-9]{1,2})?)\s*(?:\/-)?/i;
const TAXES_REGEX = /incl(?:usive)?(?:\s*of)?\s*all\s*taxes/i;

export function extractMrp(lines = []) {
  for (const line of lines) {
    const text = line.text;
    const hasMrpKeyword = /m\.?r\.?p|retail\s*price|incl.*taxes/i.test(text);

    if (hasMrpKeyword) {
      const match = text.match(MRP_REGEX);
      if (match && match[1]) {
        const rawAmount = match[1].replace(',', '.');
        const amount = parseFloat(rawAmount);

        if (!isNaN(amount) && amount > 0) {
          const hasInclusiveTaxes = TAXES_REGEX.test(text);
          const wordRefs = line.words.filter((w) => {
            const wLower = w.text.toLowerCase();
            return (
              wLower.includes(match[1]) ||
              wLower.includes('mrp') ||
              wLower.includes('rs') ||
              wLower.includes('₹')
            );
          });

          const baseConf = line.avgConfidence || 85;
          const confidence = hasInclusiveTaxes ? Math.min(baseConf / 100, 0.98) : Math.min((baseConf * 0.9) / 100, 0.90);

          return {
            name: 'mrp',
            value: {
              amount,
              currency: 'INR',
              inclusiveOfTaxes: hasInclusiveTaxes,
            },
            rawText: match[0],
            confidence: Number(confidence.toFixed(2)),
            wordRefs: wordRefs.length > 0 ? wordRefs : line.words,
          };
        }
      }
    }
  }

  return null;
}

export default extractMrp;
