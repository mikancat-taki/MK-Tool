import { useState } from "react";
import { Wrench, Globe, Calculator, Youtube, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WorldClock from "@/components/world-clock";
import CalculatorComponent from "@/components/calculator";
import YoutubePlayer from "@/components/youtube-player";
import ProxyBrowser from "@/components/proxy-browser";

type TabType = "world-clock" | "calculator" | "video-player" | "proxy";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("world-clock");

  const tabs = [
    {
      id: "world-clock" as TabType,
      label: "世界時計",
      icon: Globe,
      component: WorldClock,
    },
    {
      id: "calculator" as TabType,
      label: "電卓",
      icon: Calculator,
      component: CalculatorComponent,
    },
    {
      id: "video-player" as TabType,
      label: "動画プレイヤー",
      icon: Youtube,
      component: YoutubePlayer,
    },
    {
      id: "proxy" as TabType,
      label: "プロキシ",
      icon: Shield,
      component: ProxyBrowser,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || WorldClock;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center">
            <Wrench className="mr-3 h-6 w-6" />
            MK-Tool
          </h1>
          <p className="text-blue-100 mt-1">世界時計・電卓・動画プレイヤー・プロキシ機能</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="tab-content">
          <ActiveComponent />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2025 MK-Tool - すべての権利を保有
          </p>
          <p className="text-gray-400 text-sm mt-2">
            世界時計・電卓・動画プレイヤー・プロキシ機能を統合したWebアプリケーション
          </p>
        </div>
      </footer>
    </div>
  );
}
