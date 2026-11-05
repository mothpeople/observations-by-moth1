import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import analyticsHandler from './api/analytics.js';
import trackStoryClickHandler from './api/track-story-click.js';
import youtubeTelemetryHandler from './api/youtube-telemetry.js';
import pinterestTelemetryHandler from './api/pinterest-telemetry.js';

function localVercelApiPlugin() {
  return {
    name: 'local-vercel-api-middleware',
    configureServer(server) {
      const wrapHandler = (handlerFn) => async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost:5173');
          req.query = Object.fromEntries(urlObj.searchParams.entries());

          // Minimal Express/Vercel-compatible response wrapper
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (payload) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };

          // Parse POST body if present
          if (req.method === 'POST' && !req.body) {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const rawBody = Buffer.concat(chunks).toString('utf8');
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = rawBody;
            }
          }

          await handlerFn(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      };

      server.middlewares.use('/api/analytics', wrapHandler(analyticsHandler));
      server.middlewares.use('/api/track-story-click', wrapHandler(trackStoryClickHandler));
      server.middlewares.use('/api/youtube-telemetry', wrapHandler(youtubeTelemetryHandler));
      server.middlewares.use('/api/pinterest-telemetry', wrapHandler(pinterestTelemetryHandler));
    },
  };
}

export default defineConfig({
  plugins: [react(), localVercelApiPlugin()],
});
