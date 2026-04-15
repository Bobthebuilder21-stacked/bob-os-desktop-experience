import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Globe, Home, Plus, X, Search, ChevronDown } from "lucide-react";

interface BrowserTab {
  id: string;
  title: string;
  url: string;
}

interface SearchEngine {
  id: string;
  name: string;
  icon: string;
  searchUrl: (q: string) => string;
  homeUrl: string;
}

const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: "google",
    name: "Google",
    icon: "🔍",
    searchUrl: (q) => `https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`,
    homeUrl: "https://www.google.com/webhp?igu=1",
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    icon: "🦆",
    searchUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    homeUrl: "https://duckduckgo.com/",
  },
  {
    id: "bing",
    name: "Bing",
    icon: "🅱️",
    searchUrl: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    homeUrl: "https://www.bing.com/",
  },
  {
    id: "yahoo",
    name: "Yahoo",
    icon: "🟣",
    searchUrl: (q) => `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`,
    homeUrl: "https://search.yahoo.com/",
  },
  {
    id: "brave",
    name: "Brave Search",
    icon: "🦁",
    searchUrl: (q) => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
    homeUrl: "https://search.brave.com/",
  },
];

function isUrl(text: string): boolean {
  return /^(https?:\/\/|bobos:\/\/)/.test(text) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(text);
}

const INTERNAL_PAGES: Record<string, { title: string; content: (engine: SearchEngine, onSwitch: () => void) => React.ReactNode }> = {
  "bobos://home": {
    title: "Welcome to Bob OS Web",
    content: (engine, onSwitch) => (
      <div className="max-w-xl mx-auto text-center space-y-4 pt-20">
        <h1 className="text-2xl font-bold text-primary">Bob Browser</h1>
        <p className="text-foreground/70 text-sm">
          Searching with <button onClick={onSwitch} className="text-primary font-medium hover:underline">{engine.icon} {engine.name}</button> — click to change
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-primary/70">bobos://about</span>
          <span className="text-primary/70">bobos://help</span>
        </div>
      </div>
    ),
  },
  "bobos://about": {
    title: "About Bob OS",
    content: () => (
      <div className="max-w-xl mx-auto space-y-3 pt-10">
        <h1 className="text-xl font-bold text-primary">About Bob OS</h1>
        <p className="text-foreground/70 text-sm">Bob OS is a modern, lightweight operating system. Version 1.0.</p>
      </div>
    ),
  },
  "bobos://help": {
    title: "Help",
    content: () => (
      <div className="max-w-xl mx-auto space-y-3 pt-10">
        <h1 className="text-xl font-bold text-primary">Bob OS Help</h1>
        <ul className="text-sm text-foreground/70 space-y-1 list-disc pl-4">
          <li>Use the taskbar to launch apps</li>
          <li>Drag window title bars to move them</li>
          <li>Drag edges to resize windows</li>
          <li>Snap windows by dragging to screen edges</li>
        </ul>
      </div>
    ),
  },
};

let tabCounter = 1;

export function BobBrowser() {
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: "tab-0", title: "Home", url: "bobos://home" },
  ]);
  const [activeTab, setActiveTab] = useState("tab-0");
  const [addressInput, setAddressInput] = useState("bobos://home");
  const [engineId, setEngineId] = useState("google");
  const [showEngineMenu, setShowEngineMenu] = useState(false);

  const engine = SEARCH_ENGINES.find((e) => e.id === engineId)!;
  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const isInternal = currentTab?.url.startsWith("bobos://");

  const navigate = (url: string) => {
    let finalUrl = url;
    let title = url;

    if (url.startsWith("bobos://")) {
      title = INTERNAL_PAGES[url]?.title ?? url;
    } else if (!isUrl(url)) {
      finalUrl = engine.searchUrl(url);
      title = `${engine.name}: ${url}`;
    } else if (!url.startsWith("http")) {
      finalUrl = `https://${url}`;
      title = url;
    }

    setTabs((prev) =>
      prev.map((t) => (t.id === activeTab ? { ...t, url: finalUrl, title } : t))
    );
    setAddressInput(finalUrl);
  };

  const addTab = () => {
    const id = `tab-${tabCounter++}`;
    setTabs((prev) => [...prev, { id, title: "New Tab", url: "bobos://home" }]);
    setActiveTab(id);
    setAddressInput("bobos://home");
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id);
      setAddressInput(newTabs[newTabs.length - 1].url);
    }
  };

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) setAddressInput(tab.url);
  };

  const selectEngine = (id: string) => {
    setEngineId(id);
    setShowEngineMenu(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center bg-secondary/30 border-b border-border/40 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs cursor-pointer border-r border-border/20 min-w-[100px] max-w-[180px] transition ${
              tab.id === activeTab ? "bg-os-window-body text-foreground" : "text-foreground/50 hover:bg-secondary/40"
            }`}
          >
            <Globe className="w-3 h-3 shrink-0" />
            <span className="truncate flex-1">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="p-0.5 rounded hover:bg-secondary text-foreground/40 hover:text-foreground/70"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addTab} className="p-1.5 text-foreground/40 hover:text-foreground/70 transition">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 border-b border-border/40">
        <button className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => navigate(currentTab.url)} className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => navigate("bobos://home")} className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <Home className="w-3.5 h-3.5" />
        </button>

        {/* Search engine picker */}
        <div className="relative">
          <button
            onClick={() => setShowEngineMenu(!showEngineMenu)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-secondary text-xs text-foreground/70 transition"
            title={`Search with ${engine.name}`}
          >
            <span>{engine.icon}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showEngineMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowEngineMenu(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-os-window-body border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                {SEARCH_ENGINES.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => selectEngine(e.id)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-secondary/60 transition ${
                      e.id === engineId ? "text-primary font-semibold" : "text-foreground/70"
                    }`}
                  >
                    <span>{e.icon}</span>
                    <span>{e.name}</span>
                    {e.id === engineId && <span className="ml-auto text-primary">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-2 bg-secondary/60 rounded-md px-3 py-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(addressInput)}
            placeholder={`Search with ${engine.name} or enter URL`}
            className="flex-1 bg-transparent outline-none text-xs text-foreground"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isInternal ? (
          <div className="p-6 overflow-auto h-full">
            {(INTERNAL_PAGES[currentTab.url]?.content ?? INTERNAL_PAGES["bobos://home"]!.content)(engine, () => setShowEngineMenu(true))}
          </div>
        ) : (
          <iframe
            src={currentTab.url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Bob Browser"
          />
        )}
      </div>
    </div>
  );
}
