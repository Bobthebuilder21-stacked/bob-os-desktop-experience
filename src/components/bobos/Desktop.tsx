import { useState, useCallback } from "react";
import { Terminal, FolderOpen, Globe, Home, Trash2, Monitor } from "lucide-react";
import { StatusIndicators } from "./StatusIndicators";
import { OSWindow } from "./OSWindow";
import { BobTerminal } from "./BobTerminal";
import { BobFiles } from "./BobFiles";
import { BobBrowser } from "./BobBrowser";
import wallpaper from "@/assets/wallpaper.jpg";

type AppId = "terminal" | "files" | "browser";

interface WindowState {
  id: AppId;
  title: string;
  zIndex: number;
  minimized: boolean;
}

const APP_DEFAULTS: Record<AppId, { title: string; x: number; y: number; w: number; h: number }> = {
  terminal: { title: "Bob Terminal", x: 80, y: 80, w: 650, h: 400 },
  files: { title: "Bob Files", x: 160, y: 120, w: 700, h: 450 },
  browser: { title: "Bob Browser", x: 240, y: 60, w: 800, h: 500 },
};

const APP_ICONS: Record<AppId, typeof Terminal> = { terminal: Terminal, files: FolderOpen, browser: Globe };

interface DesktopProps {
  battery: number;
  formattedTime: string;
  formattedDate: string;
}

export function Desktop({ battery, formattedTime, formattedDate }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: "browser", title: "Bob Browser", zIndex: 1, minimized: false },
  ]);
  const [topZ, setTopZ] = useState(2);

  const openApp = useCallback(
    (id: AppId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id);
        if (existing) {
          return prev.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: topZ } : w
          );
        }
        return [...prev, { id, title: APP_DEFAULTS[id].title, zIndex: topZ, minimized: false }];
      });
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

  const focusWindow = useCallback(
    (id: AppId) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: topZ, minimized: false } : w))
      );
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const desktopIcons: { id: AppId | "trash"; label: string; icon: typeof Terminal }[] = [
    { id: "files", label: "Home", icon: Home },
    { id: "browser", label: "Bob Browser", icon: Globe },
    { id: "terminal", label: "Terminal", icon: Terminal },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  const renderAppContent = (id: AppId) => {
    switch (id) {
      case "terminal": return <BobTerminal />;
      case "files": return <BobFiles />;
      case "browser": return <BobBrowser />;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col select-none">
      {/* Panel */}
      <div className="os-panel h-10 flex items-center justify-between px-4 shrink-0 z-[9999]">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-secondary/40 transition text-sm font-semibold text-primary">
            <Monitor className="w-4 h-4" />
            Bob OS
          </button>
          {/* Pinned + open apps */}
          <div className="flex items-center gap-1">
            {(["terminal", "files", "browser"] as AppId[]).map((id) => {
              const Icon = APP_ICONS[id];
              const isOpen = windows.some((w) => w.id === id && !w.minimized);
              return (
                <button
                  key={id}
                  onClick={() => openApp(id)}
                  className={`p-1.5 rounded transition ${isOpen ? "bg-primary/20 text-primary" : "text-foreground/50 hover:bg-secondary/40 hover:text-foreground/80"}`}
                  title={APP_DEFAULTS[id].title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        <StatusIndicators battery={battery} formattedTime={formattedTime} formattedDate={formattedDate} showExtras />
      </div>

      {/* Desktop area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Desktop icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-4">
          {desktopIcons.map((item) => (
            <button
              key={item.id}
              onDoubleClick={() => item.id !== "trash" && openApp(item.id as AppId)}
              className="flex flex-col items-center gap-1 w-20 p-2 rounded-lg hover:bg-foreground/10 transition cursor-default"
            >
              <item.icon className="w-10 h-10 text-foreground/90 drop-shadow-lg" />
              <span className="text-[11px] text-foreground/90 drop-shadow-md text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Windows */}
        {windows
          .filter((w) => !w.minimized)
          .map((w) => {
            const def = APP_DEFAULTS[w.id];
            const Icon = APP_ICONS[w.id];
            return (
              <OSWindow
                key={w.id}
                id={w.id}
                title={w.title}
                icon={<Icon className="w-4 h-4" />}
                initialX={def.x}
                initialY={def.y}
                initialW={def.w}
                initialH={def.h}
                zIndex={w.zIndex}
                onFocus={() => focusWindow(w.id)}
                onClose={() => closeWindow(w.id)}
                onMinimize={() => minimizeWindow(w.id)}
              >
                {renderAppContent(w.id)}
              </OSWindow>
            );
          })}

        {/* Bob OS watermark */}
        <div className="absolute bottom-4 right-4 text-foreground/10 text-xs font-medium">
          Bob OS 1.0
        </div>
      </div>
    </div>
  );
}
