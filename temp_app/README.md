# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Performance & Security

### Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_A2UI_URL` | No | `http://localhost:3000` | WebSocket server URL. Use a `wss://` URL in production. |
| `VITE_A2UI_TOKEN` | No | _(none)_ | Optional auth token sent in the Socket.IO handshake `auth` payload. |
| `VITE_A2UI_USE_WORKER` | No | `false` | Set to `"true"` to move socket ingestion off the main thread into a Vite Web Worker (`src/services/a2uiWorker.ts`). Reduces jank during high message throughput. |

Create a `.env.local` file (git-ignored) with these variables for local development:

```sh
VITE_A2UI_URL=http://localhost:3000
# VITE_A2UI_TOKEN=your-secret-token
# VITE_A2UI_USE_WORKER=true
```

### Content-Security-Policy

A recommended CSP template is documented in `src/lib/csp.ts` and included as a commented `<meta>` tag in `index.html`. Uncomment and adjust the `connect-src` directive to match your production backend URL before deploying.

### Bundle splitting

Vite's `manualChunks` configuration splits the following large vendor libraries into separate chunks for better long-term caching:

| Chunk | Libraries |
|---|---|
| `three` | `three`, `@react-three/fiber`, `@react-three/drei` |
| `motion` | `framer-motion` |
| `charts` | `recharts` |
| `fluentui` | `@fluentui/react-components` |
| `socket` | `socket.io-client` |

### Web Vitals telemetry

Core Web Vitals (LCP, INP, CLS) are captured via `web-vitals` and logged to the console in development. In production they are sent via `navigator.sendBeacon` to `/telemetry` — implement or proxy that endpoint server-side to collect metrics.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
