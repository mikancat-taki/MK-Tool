import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Shield, Search, ExternalLink } from "lucide-react";
import { SiGoogle, SiWikipedia, SiGithub, SiStackoverflow, SiDuckduckgo } from "react-icons/si";

export default function ProxyBrowser() {
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const quickAccessSites = [
    { name: "Google", url: "https://www.google.com", icon: SiGoogle, color: "text-blue-500" },
    { name: "DuckDuckGo", url: "https://duckduckgo.com", icon: SiDuckduckgo, color: "text-red-500" },
    { name: "Wikipedia", url: "https://www.wikipedia.org", icon: SiWikipedia, color: "text-gray-600" },
    { name: "GitHub", url: "https://github.com", icon: SiGithub, color: "text-gray-800" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", icon: SiStackoverflow, color: "text-orange-500" },
  ];

  const loadProxyPage = () => {
    if (!url) {
      alert("URLを入力してください");
      return;
    }

    try {
      new URL(url);
      setProxyUrl(`/api/proxy?url=${encodeURIComponent(url)}`);
      setIsSearchMode(false);
    } catch {
      alert("有効なURLを入力してください");
    }
  };

  const performSearch = () => {
    if (!searchQuery.trim()) {
      alert("検索キーワードを入力してください");
      return;
    }

    // Use lite.duckduckgo.com for better iframe compatibility
    const searchUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(searchQuery.trim())}&kl=jp-jp`;
    setProxyUrl(`/api/proxy?url=${encodeURIComponent(searchUrl)}`);
    setIsSearchMode(true);
  };

  const setQuickUrl = (quickUrl: string) => {
    setUrl(quickUrl);
    setProxyUrl(`/api/proxy?url=${encodeURIComponent(quickUrl)}`);
    setIsSearchMode(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">プロキシブラウザ</h2>
        <p className="text-gray-600">安全にウェブサイトを閲覧・検索</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Search Section */}
          <div className="mb-6">
            <Label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              DuckDuckGo検索
            </Label>
            <div className="flex gap-3">
              <Input
                id="search-query"
                type="text"
                placeholder="検索キーワードを入力..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
              <Button onClick={performSearch} className="bg-green-600 hover:bg-green-700">
                <Search className="mr-2 h-4 w-4" />
                検索
              </Button>
            </div>
          </div>

          {/* URL Access Section */}
          <div className="mb-6">
            <Label htmlFor="proxy-url" className="block text-sm font-medium text-gray-700 mb-2">
              直接URLアクセス
            </Label>
            <div className="flex gap-3">
              <Input
                id="proxy-url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && loadProxyPage()}
              />
              <Button onClick={loadProxyPage} className="bg-blue-600 hover:bg-blue-700">
                <Globe className="mr-2 h-4 w-4" />
                アクセス
              </Button>
            </div>
          </div>

          {/* Quick Access Sites */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">クイックアクセス</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {quickAccessSites.map((site) => {
                const Icon = site.icon;
                return (
                  <Button
                    key={site.name}
                    onClick={() => setQuickUrl(site.url)}
                    variant="outline"
                    className="p-3 h-auto flex flex-col items-center gap-2 hover:bg-gray-50"
                  >
                    <Icon className={`text-xl ${site.color}`} />
                    <div className="text-sm">{site.name}</div>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="proxy-container bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            {proxyUrl ? (
              <div className="relative">
                {isSearchMode && (
                  <div className="bg-blue-50 p-2 text-sm text-blue-700 border-b">
                    <Search className="inline mr-2 h-4 w-4" />
                    DuckDuckGo検索結果: 「{searchQuery}」
                  </div>
                )}
                <iframe
                  src={proxyUrl}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  className="w-full"
                  title={isSearchMode ? "DuckDuckGo Search Results" : "Proxy Browser"}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 p-8" style={{ minHeight: "600px" }}>
                <div className="text-center">
                  <Shield className="mx-auto text-6xl mb-4 h-16 w-16" />
                  <p className="text-lg mb-2">プロキシブラウザ</p>
                  <p className="text-sm">検索またはURL入力でウェブサイトにアクセスしてください</p>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          {proxyUrl && (
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProxyUrl("");
                  setSearchQuery("");
                  setUrl("");
                  setIsSearchMode(false);
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                クリア
              </Button>
              
              {isSearchMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newSearchUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(searchQuery)}&kl=jp-jp`;
                    setProxyUrl(`/api/proxy?url=${encodeURIComponent(newSearchUrl)}`);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  検索を更新
                </Button>
              )}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                <Search className="inline mr-2 h-4 w-4" />
                アプリ内検索機能:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• DuckDuckGo検索がアプリ内で完結</li>
                <li>• プライバシーを重視した検索</li>
                <li>• 広告トラッキングなし</li>
                <li>• 検索結果の直接表示</li>
                <li>• 日本語最適化</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                <Shield className="inline mr-2 h-4 w-4" />
                セキュリティ機能:
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• SSL/TLS暗号化によるセキュアな通信</li>
                <li>• IPアドレスの匿名化</li>
                <li>• 悪意のあるサイトからの保護</li>
                <li>• プライバシー保護機能</li>
                <li>• サンドボックス環境での安全な表示</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
