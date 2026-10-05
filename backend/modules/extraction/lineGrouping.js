/**
 * Group OCR words into structured lines preserving spatial coordinates and glyph metrics.
 */

export function groupWordsIntoLines(words = []) {
  if (!Array.isArray(words) || words.length === 0) {
    return [];
  }

  // Map words by lineId if available
  const hasLineIds = words.some((w) => typeof w.lineId === 'number' || typeof w.lineId === 'string');

  let groupedMap = new Map();

  if (hasLineIds) {
    for (const word of words) {
      const lineId = word.lineId ?? 'unassigned';
      if (!groupedMap.has(lineId)) {
        groupedMap.set(lineId, []);
      }
      groupedMap.get(lineId).push(word);
    }
  } else {
    // Spatial line grouping: group words with overlapping vertical coordinates
    const sortedWords = [...words].sort((a, b) => {
      const aY = a.bbox ? a.bbox[1] : 0;
      const bY = b.bbox ? b.bbox[1] : 0;
      return aY - bY;
    });

    let currentLine = [];
    let currentY = null;
    let currentH = 0;
    let lineCounter = 1;

    for (const word of sortedWords) {
      const [, y, , h] = word.bbox || [0, 0, 0, 0];
      if (currentY === null) {
        currentY = y;
        currentH = h;
        currentLine.push(word);
      } else {
        // Check vertical overlap threshold (50% of word height)
        const verticalTolerance = Math.max(currentH, h) * 0.5;
        if (Math.abs(y - currentY) <= verticalTolerance) {
          currentLine.push(word);
        } else {
          groupedMap.set(lineCounter++, currentLine);
          currentLine = [word];
          currentY = y;
          currentH = h;
        }
      }
    }
    if (currentLine.length > 0) {
      groupedMap.set(lineCounter++, currentLine);
    }
  }

  // Convert map to structured line objects
  const lines = [];

  for (const [lineId, lineWords] of groupedMap.entries()) {
    // Sort words in line horizontally (x coordinate)
    lineWords.sort((a, b) => {
      const aX = a.bbox ? a.bbox[0] : 0;
      const bX = b.bbox ? b.bbox[0] : 0;
      return aX - bX;
    });

    const text = lineWords.map((w) => w.text).join(' ').trim();
    if (!text) continue;

    // Calculate line bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let totalConf = 0;
    let maxGlyphHeightPx = 0;

    for (const w of lineWords) {
      if (w.bbox && w.bbox.length === 4) {
        minX = Math.min(minX, w.bbox[0]);
        minY = Math.min(minY, w.bbox[1]);
        maxX = Math.max(maxX, w.bbox[0] + w.bbox[2]);
        maxY = Math.max(maxY, w.bbox[1] + w.bbox[3]);
      }
      totalConf += typeof w.conf === 'number' ? w.conf : 80;
      if (typeof w.glyphHeightPx === 'number') {
        maxGlyphHeightPx = Math.max(maxGlyphHeightPx, w.glyphHeightPx);
      }
    }

    const bbox = minX !== Infinity ? [minX, minY, maxX - minX, maxY - minY] : [0, 0, 0, 0];
    const avgConfidence = lineWords.length > 0 ? totalConf / lineWords.length : 0;

    lines.push({
      lineId,
      text,
      words: lineWords,
      bbox,
      avgConfidence,
      maxGlyphHeightPx: maxGlyphHeightPx || (bbox[3] > 0 ? bbox[3] : 0),
    });
  }

  // Sort lines vertically from top to bottom
  lines.sort((a, b) => a.bbox[1] - b.bbox[1]);

  return lines;
}

export default {
  groupWordsIntoLines,
};
