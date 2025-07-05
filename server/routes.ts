import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint for safe web browsing
  app.use('/api/proxy', (req, res, next) => {
    const targetUrl = req.query.url as string;
    
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
      new URL(targetUrl); // Validate URL
      
      const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        followRedirects: true,
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        onProxyReq: (proxyReq, req, res) => {
          // Add security headers
          proxyReq.setHeader('X-Forwarded-For', req.ip);
          proxyReq.setHeader('X-Real-IP', req.ip);
        },
        onProxyRes: (proxyRes, req, res) => {
          // Remove problematic headers that might prevent embedding
          delete proxyRes.headers['x-frame-options'];
          delete proxyRes.headers['content-security-policy'];
          
          // Add CORS headers
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        },
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
          res.status(500).json({ 
            error: 'プロキシリクエストでエラーが発生しました', 
            details: err.message 
          });
        },
        pathRewrite: {
          '^/api/proxy': '', // Remove the /api/proxy prefix
        },
        router: () => targetUrl,
      });

      return proxy(req, res, next);
    } catch (error) {
      return res.status(400).json({ 
        error: '無効なURLです', 
        details: 'URLの形式が正しくありません' 
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      services: {
        proxy: 'running',
        worldClock: 'running',
        calculator: 'running',
        youtubePlayer: 'running'
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
