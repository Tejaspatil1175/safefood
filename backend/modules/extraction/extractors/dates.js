/**
 * Extractors for Date of Manufacture/Packing and Expiry/Best Before.
 */

const DATE_REGEX = /\b([0-3]?[0-9][/.-][0-1]?[0-9][/.-](?:20)?[0-9]{2}|[0-1]?[0-9][/.-](?:20)?[0-9]{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s.-]+(?:20)?[0-9]{2})\b/i;
const BEST_BEFORE_MONTHS_REGEX = /best\s*before\s*([0-9]+)\s*months?/i;

export function extractDates(lines = []) {
  let mfg = null;
  let expiry = null;

  for (const line of lines) {
    const text = line.text;

    // Check Date of Manufacture / Packing
    const isMfg = /mfd|mfg|pkd|packed|manufactured|date\s*of\s*(?:mfg|pkd|packing)/i.test(text);
    if (isMfg && !mfg) {
      // Find date string near manufacture keyword
      const match = text.match(DATE_REGEX);
      if (match) {
        const wordRefs = line.words.filter((w) => {
          const wLower = w.text.toLowerCase();
          return wLower.includes(match[1].toLowerCase()) || /mfd|mfg|pkd|date/i.test(wLower);
        });

        mfg = {
          name: 'dateOfManufacture',
          value: match[1],
          rawText: text,
          confidence: Number(((line.avgConfidence || 85) / 100).toFixed(2)),
          wordRefs: wordRefs.length > 0 ? wordRefs : line.words,
        };
      }
    }

    // Check Expiry / Best Before
    const isExpiry = /best\s*before|use\s*by|exp(?:iry)?(?:\s*date)?/i.test(text);
    if (isExpiry && !expiry) {
      const monthsMatch = text.match(BEST_BEFORE_MONTHS_REGEX);
      if (monthsMatch) {
        expiry = {
          name: 'expiryOrBestBefore',
          value: `${monthsMatch[1]} months`,
          rawText: monthsMatch[0],
          confidence: Number(((line.avgConfidence || 85) / 100).toFixed(2)),
          wordRefs: line.words.filter((w) => /best|before|month|exp|use|by/i.test(w.text)),
        };
      } else {
        // Find date occurring after expiry keyword
        const expiryIndex = text.search(/best\s*before|use\s*by|exp(?:iry)?(?:\s*date)?/i);
        const subtext = expiryIndex !== -1 ? text.slice(expiryIndex) : text;
        const dateMatch = subtext.match(DATE_REGEX);

        if (dateMatch) {
          const wordRefs = line.words.filter((w) => {
            const wLower = w.text.toLowerCase();
            return wLower.includes(dateMatch[1].toLowerCase()) || /best|before|use|by|exp/i.test(wLower);
          });

          expiry = {
            name: 'expiryOrBestBefore',
            value: dateMatch[1],
            rawText: text,
            confidence: Number(((line.avgConfidence || 85) / 100).toFixed(2)),
            wordRefs: wordRefs.length > 0 ? wordRefs : line.words,
          };
        }
      }
    }
  }

  return {
    dateOfManufacture: mfg,
    expiryOrBestBefore: expiry,
  };
}

export default extractDates;
