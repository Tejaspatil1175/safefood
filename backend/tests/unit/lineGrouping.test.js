import { describe, it, expect } from 'vitest';
import { groupWordsIntoLines } from '../../modules/extraction/lineGrouping.js';

describe('Line Grouping', () => {
  it('should group words with explicit lineIds', () => {
    const words = [
      { text: 'Net', conf: 90, bbox: [10, 20, 30, 15], lineId: 1, glyphHeightPx: 12 },
      { text: 'Weight:', conf: 92, bbox: [45, 20, 40, 15], lineId: 1, glyphHeightPx: 12 },
      { text: '800g', conf: 95, bbox: [90, 20, 35, 15], lineId: 1, glyphHeightPx: 14 },
      { text: 'MRP', conf: 88, bbox: [10, 50, 30, 15], lineId: 2, glyphHeightPx: 12 },
      { text: 'Rs.', conf: 85, bbox: [45, 50, 20, 15], lineId: 2, glyphHeightPx: 12 },
      { text: '120.00', conf: 90, bbox: [70, 50, 40, 15], lineId: 2, glyphHeightPx: 14 },
    ];

    const lines = groupWordsIntoLines(words);
    expect(lines).toHaveLength(2);
    expect(lines[0].text).toBe('Net Weight: 800g');
    expect(lines[0].words).toHaveLength(3);
    expect(lines[0].maxGlyphHeightPx).toBe(14);
    expect(lines[1].text).toBe('MRP Rs. 120.00');
  });

  it('should group words spatially when lineId is absent', () => {
    const words = [
      { text: 'MFD', conf: 90, bbox: [10, 20, 30, 15] },
      { text: '12/2024', conf: 90, bbox: [45, 22, 50, 15] },
      { text: 'EXP', conf: 88, bbox: [10, 60, 30, 15] },
      { text: '06/2025', conf: 88, bbox: [45, 62, 50, 15] },
    ];

    const lines = groupWordsIntoLines(words);
    expect(lines).toHaveLength(2);
    expect(lines[0].text).toBe('MFD 12/2024');
    expect(lines[1].text).toBe('EXP 06/2025');
  });

  it('should handle empty input gracefully', () => {
    expect(groupWordsIntoLines([])).toEqual([]);
    expect(groupWordsIntoLines(null)).toEqual([]);
  });
});
