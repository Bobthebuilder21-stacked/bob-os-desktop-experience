import { FolderPlus, FileText, RefreshCw, Image, Settings } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onChangeWallpaper: () => void;
  onOpenSettings: () => void;
  onRefresh: () => void;
}

export function ContextMenu({ x, y, onClose, onChangeWallpaper, onOpenSettings, onRefresh }: ContextMenuProps) {
  const items = [
    { label: "New Folder", icon: FolderPlus, action: onClose },
    { label: "New File", icon: FileText, action: onClose },
    { label: "divider" as const },
    { label: "Refresh", icon: RefreshCw, action: onRefresh },
    { label: "Change Wallpaper", icon: Image, action: onChangeWallpaper },
    { label: "divider" as const },
    { label: "Settings", icon: Settings, action: onOpenSettings },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-[9999] os-window-body border border-border/60 rounded-lg shadow-xl py-1 min-w-[180px]"
        style={{ left: x, top: y }}
      >
        {items.map((item, i) =>
          item.label === "divider" ? (
            <div key={i} className="border-t border-border/40 my-1" />
          ) : (
            <button
              key={i}
              onClick={() => { item.action?.(); onClose(); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground/80 hover:bg-primary/15 hover:text-foreground transition text-left"
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              {item.label}
            </button>
          )
        )}
      </div>
    </>
  );
}
