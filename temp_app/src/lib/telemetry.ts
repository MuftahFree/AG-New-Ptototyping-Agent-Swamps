/**
 * Telemetry helpers for Agent Swamps.
 *
 * - `initWebVitals()` — reports Core Web Vitals (LCP, INP, CLS) to the console
 *   in development and via `navigator.sendBeacon` to `/telemetry` in production.
 * - `reportFrameBudget(label, ms)` — helper for R3F frame-time sampling.
 */

import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

const TELEMETRY_ENDPOINT = '/telemetry';

function sendToEndpoint(metric: Metric): void {
  if (!import.meta.env.PROD) {
    console.info('[WebVitals]', metric.name, metric.value, metric);
    return;
  }
  const body = JSON.stringify({ name: metric.name, value: metric.value, id: metric.id });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(TELEMETRY_ENDPOINT, body);
  }
}

/**
 * Initialises Core Web Vitals reporting.
 * Call once from `main.tsx`.
 */
export function initWebVitals(): void {
  onCLS(sendToEndpoint);
  onINP(sendToEndpoint);
  onLCP(sendToEndpoint);
}

/**
 * Reports a frame-budget sample.
 *
 * @param label - Identifies the subsystem (e.g. `'avatar'`).
 * @param ms    - Frame duration in milliseconds.
 */
export function reportFrameBudget(label: string, ms: number): void {
  if (!import.meta.env.PROD) {
    console.info(`[FrameBudget] ${label}: ${ms.toFixed(2)}ms`);
  }
}
