import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint for safe web browsing with enhanced DuckDuckGo support
  app.use('/api/proxy', (req: Request, res: Response, next: NextFunction) => {
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        onProxyReq: (proxyReq: any, req: Request, res: Response) => {
          // Enhanced security headers for better proxy functionality
          proxyReq.setHeader('X-Forwarded-For', req.ip || req.socket.remoteAddress);
          proxyReq.setHeader('X-Real-IP', req.ip || req.socket.remoteAddress);
          proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
          
          // Special handling for DuckDuckGo to improve compatibility
          if (targetUrl.includes('duckduckgo.com')) {
            proxyReq.setHeader('Referer', 'https://duckduckgo.com/');
            proxyReq.setHeader('Sec-Fetch-Dest', 'document');
            proxyReq.setHeader('Sec-Fetch-Mode', 'navigate');
            proxyReq.setHeader('Sec-Fetch-Site', 'same-origin');
          }
        },
        onProxyRes: (proxyRes: any, req: Request, res: Response) => {
          // Remove headers that prevent embedding
          delete proxyRes.headers['x-frame-options'];
          delete proxyRes.headers['content-security-policy'];
          delete proxyRes.headers['content-security-policy-report-only'];
          delete proxyRes.headers['strict-transport-security'];
          
          // Add CORS headers for better compatibility
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          
          // Enable caching for better performance
          proxyRes.headers['Cache-Control'] = 'public, max-age=300';
        },
        onError: (err: any, req: Request, res: Response) => {
          console.error('Proxy error:', err);
          if (!res.headersSent) {
            res.status(500).json({ 
              error: 'プロキシリクエストでエラーが発生しました', 
              details: err.message 
            });
          }
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
