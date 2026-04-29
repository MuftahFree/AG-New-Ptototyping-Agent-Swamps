/**
 * Content-Security-Policy reference for Agent Swamps.
 *
 * This module exports a recommended CSP string for documentation purposes.
 * To activate it, copy the `<meta>` tag below into `index.html` and adjust
 * the `connect-src` directive to match your actual backend domains.
 *
 * A matching commented template is also present in `index.html`.
 *
 * @example
 * // index.html
 * <!-- Content-Security-Policy (see src/lib/csp.ts for the full recommended value)
 * <meta http-equiv="Content-Security-Policy" content="..." />
 * -->
 */

/**
 * Recommended Content-Security-Policy for production deployments.
 *
 * Adjust `connect-src` to whitelist your actual WebSocket backend URL.
 * Replace `'nonce-REPLACE_ME'` with a per-request nonce injected by your server,
 * or switch to a hash-based approach for static deployments.
 */
export const RECOMMENDED_CSP =
  [
    "default-src 'self'",
    // Inline styles are needed by Fluent UI / framer-motion injected styles.
    "style-src 'self' 'unsafe-inline'",
    // Scripts: self only; no 'unsafe-eval'.
    "script-src 'self'",
    // WebSocket + REST calls to the Agent Swamps backend.
    "connect-src 'self' wss://your-backend.example.com https://your-backend.example.com",
    // Images: self + data URIs used by Three.js textures.
    "img-src 'self' data: blob:",
    // Fonts: self (add CDN origin if using Google Fonts or similar).
    "font-src 'self'",
    // Workers: blob: required for Three.js / Vite workers.
    "worker-src 'self' blob:",
    // No plugins, frames, or form submissions expected.
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
