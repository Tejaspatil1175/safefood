/**
 * Extractor for Manufacturer / Packer name and address.
 */

const MFG_KEYWORD_REGEX = /\b(?:mfg\.?\s*by|manufactured\s*by|packed\s*by|pkd\.?\s*by|marketed\s*by|imported\s*by|mfd\.?\s*by)\b/i;
const PINCODE_REGEX = /\b[1-9][0-9]{5}\b/;

export function extractManufacturer(lines = []) {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const text = line.text;

    if (MFG_KEYWORD_REGEX.test(text)) {
      // Collect this line and up to next 2 lines if they contain address details / pincode
      const collectedLines = [line];
      let collectedText = text;

      for (let j = i + 1; j < Math.min(i + 3, lines.length); j += 1) {
        const nextLine = lines[j];
        // If next line has unrelated keywords (MRP, Net Qty, FSSAI), stop
        if (/mrp|net\s*wt|fssai|lic|batch|exp/i.test(nextLine.text)) {
          break;
        }
        collectedLines.push(nextLine);
        collectedText += ` ${nextLine.text}`;
        if (PINCODE_REGEX.test(nextLine.text)) {
          break;
        }
      }

      const allWords = collectedLines.flatMap((l) => l.words);
      const hasPincode = PINCODE_REGEX.test(collectedText);
      const baseConf = line.avgConfidence || 85;
      const confidence = hasPincode ? Math.min(baseConf / 100, 0.95) : Math.min((baseConf * 0.85) / 100, 0.85);

      return {
        name: 'manufacturer',
        value: {
          raw: collectedText.trim(),
          hasAddress: hasPincode || /street|road|nagar|industrial|estate|dist|mumbai|delhi|bengaluru|kolkata|chennai|pune/i.test(collectedText),
          hasPincode,
        },
        rawText: collectedText.trim(),
        confidence: Number(confidence.toFixed(2)),
        wordRefs: allWords,
      };
    }
  }

  return null;
}

export default extractManufacturer;
