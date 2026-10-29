import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import analyticsHandler from './api/analytics.js';

function localVercelApiPlugin() {
  return {
    name: 'local-vercel-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/analytics', async (req, res) => {
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

          await analyticsHandler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localVercelApiPlugin()],
});
