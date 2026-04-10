import { useState, useCallback } from "react";
import { Terminal, FolderOpen, Globe, Home, Trash2, Monitor, Settings, FileText, Image, LogOut } from "lucide-react";
import { StatusIndicators } from "./StatusIndicators";
import { OSWindow } from "./OSWindow";
import { BobTerminal } from "./BobTerminal";
import { BobFiles } from "./BobFiles";
import { BobBrowser } from "./BobBrowser";
import { BobSettings } from "./BobSettings";
import { BobTextEditor } from "./BobTextEditor";
import { BobImageViewer } from "./BobImageViewer";
import { WallpaperPicker } from "./WallpaperPicker";
import { ContextMenu } from "./ContextMenu";
import { AppLauncher } from "./AppLauncher";
import { getWallpaperSrc } from "./wallpapers";
import type { AppId, WindowState } from "./types";
import type { User } from "@supabase/supabase-js";

const APP_DEFAULTS: Record<AppId, { title: string; x: number; y: number; w: number; h: number }> = {
  terminal: { title: "Bob Terminal", x: 80, y: 80, w: 650, h: 400 },
  files: { title: "Bob Files", x: 160, y: 120, w: 700, h: 450 },
  browser: { title: "Bob Browser", x: 240, y: 60, w: 800, h: 500 },
  settings: { title: "Settings", x: 300, y: 100, w: 400, h: 380 },
  texteditor: { title: "Text Editor", x: 200, y: 90, w: 600, h: 420 },
  imageviewer: { title: "Image Viewer", x: 180, y: 70, w: 500, h: 400 },
  wallpaperpicker: { title: "Wallpapers", x: 320, y: 80, w: 520, h: 380 },
};

const APP_ICONS: Record<AppId, typeof Terminal> = {
  terminal: Terminal,
  files: FolderOpen,
  browser: Globe,
  settings: Settings,
  texteditor: FileText,
  imageviewer: Image,
  wallpaperpicker: Image,
};

let windowCounter = 0;

interface DesktopProps {
  battery: number;
  formattedTime: string;
  formattedDate: string;
  wallpaper: string;
  onWallpaperChange: (id: string) => void;
  user: User | null;
  onSignOut: () => void;
}

export function Desktop({ battery, formattedTime, formattedDate, wallpaper, onWallpaperChange, user, onSignOut }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>(() => {
    const def = APP_DEFAULTS.browser;
    return [{ id: `win-${windowCounter++}`, appId: "browser", title: def.title, zIndex: 1, minimized: false, x: def.x, y: def.y, w: def.w, h: def.h }];
  });
  const [topZ, setTopZ] = useState(2);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showLauncher, setShowLauncher] = useState(false);

  const openApp = useCallback(
    (appId: AppId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === appId);
        if (existing) {
          return prev.map((w) => w.id === existing.id ? { ...w, minimized: false, zIndex: topZ } : w);
        }
        const def = APP_DEFAULTS[appId];
        return [...prev, {
          id: `win-${windowCounter++}`,
          appId,
          title: def.title,
          zIndex: topZ,
          minimized: false,
          x: def.x,
          y: def.y,
          w: def.w,
          h: def.h,
        }];
      });
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) => prev.map((w) => w.id === id ? { ...w, zIndex: topZ, minimized: false } : w));
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => w.id === id ? { ...w, x, y } : w));
  }, []);

  const resizeWindow = useCallback((id: string, w: number, h: number) => {
    setWindows((prev) => prev.map((win) => win.id === id ? { ...win, w, h } : win));
  }, []);

  const desktopIcons: { appId: AppId | "trash"; label: string; icon: typeof Terminal }[] = [
    { appId: "files", label: "Home", icon: Home },
    { appId: "browser", label: "Bob Browser", icon: Globe },
    { appId: "terminal", label: "Terminal", icon: Terminal },
    { appId: "texteditor", label: "Text Editor", icon: FileText },
    { appId: "trash", label: "Trash", icon: Trash2 },
  ];

  const renderApp = (appId: AppId) => {
    switch (appId) {
      case "terminal": return <BobTerminal />;
      case "files": return <BobFiles />;
      case "browser": return <BobBrowser />;
      case "settings": return <BobSettings user={user} onSignOut={onSignOut} onChangeWallpaper={() => openApp("wallpaperpicker")} />;
      case "texteditor": return <BobTextEditor />;
      case "imageviewer": return <BobImageViewer />;
      case "wallpaperpicker": return <WallpaperPicker current={wallpaper} onSelect={onWallpaperChange} />;
    }
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const wallpaperSrc = getWallpaperSrc(wallpaper);

  return (
    <div className="fixed inset-0 flex flex-col select-none">
      {/* Panel */}
      <div className="os-panel h-10 flex items-center justify-between px-4 shrink-0 z-[9999]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLauncher(!showLauncher)}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-secondary/40 transition text-sm font-semibold text-primary"
          >
            <Monitor className="w-4 h-4" />
            Bob OS
          </button>
          <div className="flex items-center gap-1">
            {(["terminal", "files", "browser", "settings"] as AppId[]).map((appId) => {
              const Icon = APP_ICONS[appId];
              const isOpen = windows.some((w) => w.appId === appId && !w.minimized);
              return (
                <button
                  key={appId}
                  onClick={() => openApp(appId)}
                  className={`p-1.5 rounded transition ${isOpen ? "bg-primary/20 text-primary" : "text-foreground/50 hover:bg-secondary/40 hover:text-foreground/80"}`}
                  title={APP_DEFAULTS[appId].title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          {/* Taskbar window buttons */}
          <div className="flex items-center gap-0.5 ml-2 border-l border-border/30 pl-2">
            {windows.map((w) => {
              const Icon = APP_ICONS[w.appId];
              return (
                <button
                  key={w.id}
                  onClick={() => focusWindow(w.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                    !w.minimized ? "bg-secondary/50 text-foreground/80" : "text-foreground/40 hover:bg-secondary/30"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="max-w-[80px] truncate">{w.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicators battery={battery} formattedTime={formattedTime} formattedDate={formattedDate} showExtras />
          <button onClick={onSignOut} className="p-1 rounded hover:bg-secondary/40 text-foreground/40 hover:text-foreground/70 transition" title="Sign Out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Desktop area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ backgroundImage: `url(${wallpaperSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
        onContextMenu={handleDesktopContextMenu}
      >
        {/* Desktop icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-3">
          {desktopIcons.map((item) => (
            <button
              key={item.appId}
              onDoubleClick={() => item.appId !== "trash" && openApp(item.appId as AppId)}
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
            const Icon = APP_ICONS[w.appId];
            return (
              <OSWindow
                key={w.id}
                id={w.id}
                title={w.title}
                icon={<Icon className="w-4 h-4" />}
                x={w.x}
                y={w.y}
                w={w.w}
                h={w.h}
                zIndex={w.zIndex}
                onFocus={() => focusWindow(w.id)}
                onClose={() => closeWindow(w.id)}
                onMinimize={() => minimizeWindow(w.id)}
                onMove={(x, y) => moveWindow(w.id, x, y)}
                onResize={(width, height) => resizeWindow(w.id, width, height)}
              >
                {renderApp(w.appId)}
              </OSWindow>
            );
          })}

        <div className="absolute bottom-4 right-4 text-foreground/10 text-xs font-medium">Bob OS 1.0</div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onChangeWallpaper={() => { setContextMenu(null); openApp("wallpaperpicker"); }}
          onOpenSettings={() => { setContextMenu(null); openApp("settings"); }}
          onRefresh={() => setContextMenu(null)}
        />
      )}

      {/* App launcher */}
      {showLauncher && (
        <AppLauncher onLaunch={openApp} onClose={() => setShowLauncher(false)} />
      )}
    </div>
  );
}
