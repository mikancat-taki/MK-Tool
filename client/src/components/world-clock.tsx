import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Cloud, CloudSun } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ClockData {
  city: string;
  timezone: string;
  icon: typeof Sun;
  borderColor: string;
}

const clocks: ClockData[] = [
  {
    city: "東京",
    timezone: "Asia/Tokyo",
    icon: Sun,
    borderColor: "border-l-orange-500",
  },
  {
    city: "ニューヨーク",
    timezone: "America/New_York",
    icon: Moon,
    borderColor: "border-l-blue-500",
  },
  {
    city: "ロンドン",
    timezone: "Europe/London",
    icon: Cloud,
    borderColor: "border-l-green-500",
  },
  {
    city: "シドニー",
    timezone: "Australia/Sydney",
    icon: Sun,
    borderColor: "border-l-purple-500",
  },
  {
    city: "ベルリン",
    timezone: "Europe/Berlin",
    icon: CloudSun,
    borderColor: "border-l-red-500",
  },
  {
    city: "ドバイ",
    timezone: "Asia/Dubai",
    icon: Sun,
    borderColor: "border-l-yellow-500",
  },
];

export default function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(currentTime);
  };

  const formatDate = (timezone: string) => {
    const date = new Date(currentTime.toLocaleString("en-US", { timeZone: timezone }));
    return format(date, "yyyy年MM月dd日(EEEE)", { locale: ja });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">世界時計</h2>
        <p className="text-gray-600">世界各地の現在時刻をリアルタイムで表示</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clocks.map((clock) => {
          const Icon = clock.icon;
          return (
            <Card key={clock.city} className={`border-l-4 ${clock.borderColor} shadow-md`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{clock.city}</h3>
                  <Icon className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="clock-time text-3xl font-bold text-blue-600 mb-2">
                  {formatTime(clock.timezone)}
                </div>
                <div className="clock-date text-sm text-gray-600">
                  {formatDate(clock.timezone)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
