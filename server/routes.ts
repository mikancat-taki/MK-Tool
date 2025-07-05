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
          delete proxyRes.headers['x-content-type-options'];
          
          // Add CORS headers for better compatibility
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          
          // Special handling for DuckDuckGo
          if (targetUrl.includes('duckduckgo.com')) {
            // Allow iframe embedding for DuckDuckGo
            proxyRes.headers['X-Frame-Options'] = 'ALLOWALL';
            // Modify content type for better iframe compatibility
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
              proxyRes.headers['content-type'] = 'text/html; charset=utf-8';
            }
          }
          
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

  // DuckDuckGo Search endpoint
  app.post('/api/search', async (req: Request, res: Response) => {
    try {
      const { query, max_results = 10, region = 'jp-jp', safesearch = 'moderate' } = req.body;

      if (!query) {
        return res.status(400).json({ error: '検索キーワードが必要です' });
      }

      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}&kl=${region}&safe=${safesearch}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
          'DNT': '1',
        },
      });

      if (!response.ok) {
        throw new Error('DuckDuckGo search failed');
      }

      const html = await response.text();
      
      // Simple HTML parsing to extract search results
      const results = parseSearchResults(html, max_results);
      
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ 
        error: '検索中にエラーが発生しました', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Translation endpoint
  app.post('/api/translate', async (req: Request, res: Response) => {
    try {
      const { text, from = 'auto', to = 'ja' } = req.body;

      if (!text) {
        return res.status(400).json({ error: '翻訳するテキストが必要です' });
      }

      // Use Google Translate free API endpoint
      const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(translateUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();
      
      // Extract translated text from Google Translate response
      let translatedText = '';
      if (data && data[0] && Array.isArray(data[0])) {
        translatedText = data[0].map((item: any) => item[0]).join('');
      }

      res.json({
        text: translatedText,
        sourceLanguage: from,
        targetLanguage: to,
      });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ 
        error: '翻訳中にエラーが発生しました', 
        details: error instanceof Error ? error.message : 'Unknown error' 
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
        youtubePlayer: 'running',
        search: 'running',
        translator: 'running'
      }
    });
  });

  // Helper function to parse DuckDuckGo search results
  function parseSearchResults(html: string, maxResults: number) {
    const results: any[] = [];
    
    // Simple regex-based parsing for DuckDuckGo results
    const resultPattern = /<div class="links_main[^>]*>.*?<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>.*?<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([^<]+)<\/a>/g;
    
    let match;
    let count = 0;
    
    while ((match = resultPattern.exec(html)) !== null && count < maxResults) {
      const href = match[1];
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      const body = match[3].replace(/<[^>]*>/g, '').trim();
      
      if (href && title && body) {
        results.push({
          title: title,
          href: href.startsWith('//') ? 'https:' + href : href,
          body: body
        });
        count++;
      }
    }
    
    // Fallback: if regex parsing fails, return a basic structure
    if (results.length === 0) {
      // Try alternative parsing method
      const titleMatches = html.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g);
      if (titleMatches) {
        titleMatches.slice(0, maxResults).forEach(match => {
          const hrefMatch = match.match(/href="([^"]+)"/);
          const titleMatch = match.match(/>([^<]+)<\/a>/);
          
          if (hrefMatch && titleMatch) {
            results.push({
              title: titleMatch[1].trim(),
              href: hrefMatch[1].startsWith('//') ? 'https:' + hrefMatch[1] : hrefMatch[1],
              body: 'No description available'
            });
          }
        });
      }
    }
    
    return results;
  }

  const httpServer = createServer(app);
  return httpServer;
}
