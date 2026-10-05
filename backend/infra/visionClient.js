import { UpstreamError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

export async function analyzeImage(imageBuffer, {
  mimeType = 'image/jpeg',
  filename = 'label.jpg',
  referenceHint = null,
  knownPanelMm = null,
  timeoutMs = 5000,
  maxRetries = 1,
} = {}) {
  const visionUrl = process.env.VISION_URL || 'http://localhost:8000';
  const url = `${visionUrl.replace(/\/$/, '')}/v1/analyze`;

  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      attempts += 1;

      const formData = new FormData();
      const blob = new Blob([imageBuffer], { type: mimeType });
      formData.append('image', blob, filename);

      if (referenceHint) {
        formData.append('referenceHint', referenceHint);
      }
      if (knownPanelMm) {
        formData.append('knownPanelMm', JSON.stringify(knownPanelMm));
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new UpstreamError(`Vision service returned HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const isLastAttempt = attempts > maxRetries;
      logger.warn(
        { attempt: attempts, err: err.message, url },
        `Vision service request failed${isLastAttempt ? '' : ', retrying...'}`,
      );

      if (isLastAttempt) {
        if (err instanceof UpstreamError) {
          throw err;
        }
        throw new UpstreamError(`Failed to communicate with vision service: ${err.message}`);
      }
    }
  }
}

export default {
  analyzeImage,
};
