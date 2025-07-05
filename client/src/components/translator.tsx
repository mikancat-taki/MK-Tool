import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowRightLeft, Copy, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslationResult {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export default function Translator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("ja");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: "auto", name: "自動検出" },
    { code: "ja", name: "日本語" },
    { code: "en", name: "英語" },
    { code: "ko", name: "韓国語" },
    { code: "zh", name: "中国語（簡体字）" },
    { code: "zh-tw", name: "中国語（繁体字）" },
    { code: "fr", name: "フランス語" },
    { code: "de", name: "ドイツ語" },
    { code: "es", name: "スペイン語" },
    { code: "it", name: "イタリア語" },
    { code: "pt", name: "ポルトガル語" },
    { code: "ru", name: "ロシア語" },
    { code: "ar", name: "アラビア語" },
    { code: "hi", name: "ヒンディー語" },
    { code: "th", name: "タイ語" },
    { code: "vi", name: "ベトナム語" },
  ];

  const translateText = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "エラー",
        description: "翻訳するテキストを入力してください",
        variant: "destructive",
      });
      return;
    }

    if (sourceLanguage === targetLanguage && sourceLanguage !== "auto") {
      toast({
        title: "エラー",
        description: "翻訳元と翻訳先の言語が同じです",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          from: sourceLanguage,
          to: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('翻訳リクエストが失敗しました');
      }

      const result: TranslationResult = await response.json();
      setTranslatedText(result.text);
      
      toast({
        title: "翻訳完了",
        description: "テキストが正常に翻訳されました",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "翻訳エラー",
        description: "翻訳中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage !== "auto") {
      const tempLang = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(tempLang);
      
      // Also swap the text content
      const tempText = sourceText;
      setSourceText(translatedText);
      setTranslatedText(tempText);
    } else {
      toast({
        title: "言語交換不可",
        description: "自動検出が選択されている場合は言語を交換できません",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "コピー完了",
        description: "テキストがクリップボードにコピーされました",
      });
    } catch (error) {
      toast({
        title: "コピーエラー",
        description: "テキストのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      translateText();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">翻訳機能</h2>
        <p className="text-gray-600">多言語間でのテキスト翻訳</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Language Selection */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="source-lang" className="block text-sm font-medium text-gray-700 mb-2">
                翻訳元言語
              </Label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="言語を選択" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={swapLanguages}
              className="mt-6"
              disabled={sourceLanguage === "auto"}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <Label htmlFor="target-lang" className="block text-sm font-medium text-gray-700 mb-2">
                翻訳先言語
              </Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="言語を選択" />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(lang => lang.code !== "auto").map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Input/Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="source-text" className="block text-sm font-medium text-gray-700 mb-2">
                翻訳するテキスト
              </Label>
              <div className="relative">
                <Textarea
                  id="source-text"
                  placeholder="翻訳したいテキストを入力してください..."
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="min-h-[200px] resize-none"
                />
                {sourceText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sourceText)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ctrl + Enter で翻訳
              </p>
            </div>

            <div>
              <Label htmlFor="translated-text" className="block text-sm font-medium text-gray-700 mb-2">
                翻訳結果
              </Label>
              <div className="relative">
                <Textarea
                  id="translated-text"
                  placeholder="翻訳結果がここに表示されます..."
                  value={translatedText}
                  readOnly
                  className="min-h-[200px] resize-none bg-gray-50"
                />
                {translatedText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(translatedText)}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={translateText}
              disabled={isTranslating || !sourceText.trim()}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              <Languages className="mr-2 h-4 w-4" />
              {isTranslating ? "翻訳中..." : "翻訳"}
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              <Languages className="inline mr-2 h-4 w-4" />
              使い方:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 翻訳したいテキストを左側のテキストエリアに入力</li>
              <li>• 翻訳元と翻訳先の言語を選択</li>
              <li>• 「翻訳」ボタンをクリックまたはCtrl+Enterで翻訳実行</li>
              <li>• コピーボタンで結果をクリップボードにコピー可能</li>
              <li>• 矢印ボタンで言語とテキストの交換が可能</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}