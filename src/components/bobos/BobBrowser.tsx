import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Globe } from "lucide-react";

const PAGES: Record<string, { title: string; content: React.ReactNode }> = {
  "bobos://home": {
    title: "Welcome to Bob OS Web",
    content: (
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-primary">Welcome to Bob OS Web</h1>
        <p className="text-foreground/70 text-sm">Your gateway to the Bob OS ecosystem. Explore the web from inside your Bob OS desktop.</p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-primary underline cursor-pointer">About Bob OS</span>
          <span className="text-primary underline cursor-pointer">Help</span>
        </div>
      </div>
    ),
  },
  "bobos://about": {
    title: "About Bob OS",
    content: (
      <div className="max-w-xl mx-auto space-y-3">
        <h1 className="text-xl font-bold text-primary">About Bob OS</h1>
        <p className="text-foreground/70 text-sm">Bob OS is a modern, lightweight operating system built for simplicity and elegance. Version 1.0.</p>
        <p className="text-foreground/60 text-xs">© 2026 Bob OS Project</p>
      </div>
    ),
  },
  "bobos://help": {
    title: "Help",
    content: (
      <div className="max-w-xl mx-auto space-y-3">
        <h1 className="text-xl font-bold text-primary">Bob OS Help</h1>
        <ul className="text-sm text-foreground/70 space-y-1 list-disc pl-4">
          <li>Use the taskbar to launch apps</li>
          <li>Drag window title bars to move them</li>
          <li>Double-click the title bar to maximize</li>
          <li>Use the terminal for command-line access</li>
        </ul>
      </div>
    ),
  },
};

export function BobBrowser() {
  const [url, setUrl] = useState("bobos://home");
  const [displayUrl, setDisplayUrl] = useState("bobos://home");
  const [history, setHistory] = useState<string[]>(["bobos://home"]);
  const [histIdx, setHistIdx] = useState(0);

  const navigate = (to: string) => {
    const resolved = PAGES[to] ? to : "bobos://home";
    setUrl(resolved);
    setDisplayUrl(resolved);
    const newHist = [...history.slice(0, histIdx + 1), resolved];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
  };

  const goBack = () => {
    if (histIdx > 0) {
      const idx = histIdx - 1;
      setHistIdx(idx);
      setUrl(history[idx]);
      setDisplayUrl(history[idx]);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const idx = histIdx + 1;
      setHistIdx(idx);
      setUrl(history[idx]);
      setDisplayUrl(history[idx]);
    }
  };

  const page = PAGES[url] ?? PAGES["bobos://home"];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 border-b border-border/40">
        <button onClick={goBack} className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={goForward} className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => navigate(url)} className="p-1 rounded hover:bg-secondary text-foreground/50 hover:text-foreground/80 transition">
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-secondary/60 rounded-md px-3 py-1">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(displayUrl)}
            className="flex-1 bg-transparent outline-none text-xs text-foreground"
          />
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">{page.content}</div>
    </div>
  );
}
