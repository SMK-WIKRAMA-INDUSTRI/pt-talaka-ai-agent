import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const netraProxyConfig = {
  '/api/netra': {
    target: 'https://api.netra.sh',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api\/netra/, ''),
  },
};

function readRawBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      if (!text) return resolve({});
      try {
        resolve(JSON.parse(text));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function createLocalBackendApiPlugin(envVars) {
  const routes = {
    '/api/sync-trends': path.resolve(__dirname, './api/sync-trends.js'),
    '/api/notify-order': path.resolve(__dirname, './api/notify-order.js'),
    '/api/cron-analysis': path.resolve(__dirname, './api/cron-analysis.js'),
  };

  return {
    name: 'talaka-local-backend-api',
    configureServer(server) {
      Object.entries(envVars).forEach(([key, val]) => {
        if (!process.env[key] && val) {
          process.env[key] = val;
        }
      });

      server.middlewares.use(async (req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0];
        const handlerPath = routes[cleanUrl];
        if (!handlerPath) return next();

        try {
          req.body =
            req.method === 'POST' || req.method === 'PUT'
              ? await readRawBody(req)
              : {};

          const wrappedRes = {
            statusCode: 200,
            status(code) {
              this.statusCode = code;
              res.statusCode = code;
              return this;
            },
            json(payload) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
              return this;
            },
          };

          const mod = await import(
            `${pathToFileURL(handlerPath).href}?t=${Date.now()}`
          );
          await mod.default(req, wrappedRes);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, __dirname, '');
  return {
    plugins: [react(), tailwindcss(), createLocalBackendApiPlugin(envVars)],
    server: {
      proxy: netraProxyConfig,
    },
    preview: {
      proxy: netraProxyConfig,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        cn: path.resolve(__dirname, './src/lib/utils.js'),
      },
    },
  };
});
