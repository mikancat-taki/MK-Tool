import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ExternalLink, Clock, Globe } from "lucide-react";
import { SiDuckduckgo } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  title: string;
  href: string;
  body: string;
}

export default function DuckDuckGoSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const { toast } = useToast();

  const performSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "エラー",
        description: "検索キーワードを入力してください",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          max_results: 10,
          region: 'jp-jp',
          safesearch: 'moderate'
        }),
      });

      if (!response.ok) {
        throw new Error('検索リクエストが失敗しました');
      }

      const searchResults: SearchResult[] = await response.json();
      setResults(searchResults);
      setSearchTime(Date.now() - startTime);
      
      toast({
        title: "検索完了",
        description: `${searchResults.length}件の結果が見つかりました`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "検索エラー",
        description: "検索中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
      setResults([]);
      setSearchTime(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const openInProxy = (url: string) => {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    window.open(proxyUrl, '_blank');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <SiDuckduckgo className="mr-3 h-6 w-6 text-red-500" />
          DuckDuckGo検索
        </h2>
        <p className="text-gray-600">プライバシーを重視した検索エンジン</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Search Input */}
          <div className="mb-6">
            <Label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              検索キーワード
            </Label>
            <div className="flex gap-3">
              <Input
                id="search-query"
                type="text"
                placeholder="検索したいキーワードを入力..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={performSearch} 
                disabled={isSearching || !query.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? "検索中..." : "検索"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enterキーで検索実行
            </p>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">検索結果</h3>
                {searchTime && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    {searchTime}ms
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-2">
                      <h4 className="text-blue-600 font-medium hover:underline cursor-pointer text-lg">
                        <a 
                          href={result.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          {result.title}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </h4>
                      <p className="text-green-700 text-sm truncate">{result.href}</p>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{result.body}</p>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInProxy(result.href)}
                        className="text-xs"
                      >
                        <Globe className="mr-1 h-3 w-3" />
                        プロキシで開く
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!isSearching && results.length === 0 && query && (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">検索結果が見つかりませんでした</p>
              <p className="text-gray-400 text-sm">キーワードを変更して再度お試しください</p>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">検索中...</p>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">
              <SiDuckduckgo className="inline mr-2 h-4 w-4" />
              DuckDuckGoの特徴:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• プライバシーを重視：個人データの追跡なし</li>
              <li>• 広告のパーソナライゼーションなし</li>
              <li>• 検索履歴の保存なし</li>
              <li>• セキュアな検索環境</li>
              <li>• プロキシ機能で安全なサイト閲覧</li>
            </ul>
          </div>

          {/* Search Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">検索のコツ:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <code>"完全一致"</code>: 引用符で囲んで完全一致検索</p>
              <p>• <code>site:example.com</code>: 特定サイト内検索</p>
              <p>• <code>filetype:pdf</code>: ファイル形式指定検索</p>
              <p>• <code>-除外ワード</code>: マイナス記号で除外検索</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}