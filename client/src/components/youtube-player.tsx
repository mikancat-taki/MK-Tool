import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Play, PlayCircle } from "lucide-react";

export default function YoutubePlayer() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const extractVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  };

  const loadVideo = () => {
    if (!url) {
      alert("YouTubeのURLを入力してください");
      return;
    }

    const extractedId = extractVideoId(url);
    if (!extractedId) {
      alert("有効なYouTube URLを入力してください");
      return;
    }

    setVideoId(extractedId);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">YouTube動画プレイヤー</h2>
        <p className="text-gray-600">YouTubeのURLを入力して動画を再生</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="mb-6">
            <Label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL
            </Label>
            <div className="flex gap-3">
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={loadVideo} className="bg-blue-600 hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                再生
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              通常の動画URL: https://www.youtube.com/watch?v=VIDEO_ID<br />
              ショート動画: /shorts/をwatch?v=に変更してください
            </p>
          </div>

          <div className="video-container bg-gray-100 rounded-lg overflow-hidden">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 py-32">
                <div className="text-center">
                  <PlayCircle className="mx-auto text-6xl mb-4 h-16 w-16" />
                  <p className="text-lg">上記にYouTube URLを入力して再生ボタンを押してください</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">使用方法:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• YouTubeの動画ページでURLをコピー</li>
              <li>• 上記の入力欄にURLを貼り付け</li>
              <li>• 「再生」ボタンをクリックして動画を表示</li>
              <li>• 一部の動画は埋め込み制限により再生できない場合があります</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
