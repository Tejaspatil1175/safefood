import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeImage } from '../../infra/visionClient.js';
import { UpstreamError } from '../../lib/errors.js';

describe('Vision Client', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should return parsed vision result on successful analysis', async () => {
    const mockResult = {
      quality: { ok: true, issues: [], metrics: {} },
      scale: { pxPerMm: 10.5, method: 'aruco', confidence: 0.95 },
      barcode: { value: '8901719101038', type: 'EAN13' },
      words: [
        { text: 'Net', conf: 95, bbox: [10, 10, 30, 20], lineId: 1, blockId: 1, glyphHeightPx: 25 },
        { text: '800g', conf: 90, bbox: [45, 10, 40, 20], lineId: 1, blockId: 1, glyphHeightPx: 25 },
      ],
      timingsMs: { preprocess: 20, ocr: 150, total: 180 },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    });

    const fakeBuffer = Buffer.from('fake-image-bytes');
    const result = await analyzeImage(fakeBuffer);

    expect(result).toEqual(mockResult);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry once on network failure and throw UpstreamError if still failing', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'));

    const fakeBuffer = Buffer.from('fake-image-bytes');
    await expect(analyzeImage(fakeBuffer, { maxRetries: 1 })).rejects.toThrow(UpstreamError);
    // Initial call + 1 retry = 2 attempts
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw UpstreamError when upstream returns 500', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error in Vision Pipeline',
    });

    const fakeBuffer = Buffer.from('fake-image-bytes');
    await expect(analyzeImage(fakeBuffer, { maxRetries: 0 })).rejects.toThrow(UpstreamError);
  });
});
