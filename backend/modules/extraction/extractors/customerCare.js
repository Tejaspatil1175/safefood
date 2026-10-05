/**
 * Extractor for Consumer / Customer Care grievance redressal contact.
 */

const CARE_KEYWORD_REGEX = /customer\s*care|consumer\s*care|grievance|feedback|helpline|toll\s*free|care@/i;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const PHONE_REGEX = /\b(?:1800[-\s]?[0-9]{3}[-\s]?[0-9]{3,4}|[0-9]{10,11})\b/;

export function extractCustomerCare(lines = []) {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const text = line.text;

    if (CARE_KEYWORD_REGEX.test(text)) {
      const collectedLines = [line];
      let collectedText = text;

      for (let j = i + 1; j < Math.min(i + 3, lines.length); j += 1) {
        const nextLine = lines[j];
        if (/mrp|net\s*wt|fssai|ingredients|nutrition/i.test(nextLine.text)) {
          break;
        }
        collectedLines.push(nextLine);
        collectedText += ` ${nextLine.text}`;
      }

      const emailMatch = collectedText.match(EMAIL_REGEX);
      const phoneMatch = collectedText.match(PHONE_REGEX);
      const allWords = collectedLines.flatMap((l) => l.words);

      const hasEmail = Boolean(emailMatch);
      const hasPhone = Boolean(phoneMatch);
      const baseConf = line.avgConfidence || 85;
      const confidence = (hasEmail || hasPhone) ? Math.min(baseConf / 100, 0.95) : Math.min((baseConf * 0.8) / 100, 0.80);

      return {
        name: 'customerCare',
        value: {
          raw: collectedText.trim(),
          email: emailMatch ? emailMatch[0] : null,
          phone: phoneMatch ? phoneMatch[0] : null,
          hasContactChannel: hasEmail || hasPhone,
        },
        rawText: collectedText.trim(),
        confidence: Number(confidence.toFixed(2)),
        wordRefs: allWords,
      };
    }
  }

  return null;
}

export default extractCustomerCare;
