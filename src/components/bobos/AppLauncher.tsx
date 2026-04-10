import { Terminal, FolderOpen, Globe, Settings, FileText, Image } from "lucide-react";
import type { AppId } from "./types";

interface AppLauncherProps {
  onLaunch: (id: AppId) => void;
  onClose: () => void;
}

const APPS: { id: AppId; label: string; icon: typeof Terminal }[] = [
  { id: "browser", label: "Bob Browser", icon: Globe },
  { id: "files", label: "Bob Files", icon: FolderOpen },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "texteditor", label: "Text Editor", icon: FileText },
  { id: "imageviewer", label: "Image Viewer", icon: Image },
];

export function AppLauncher({ onLaunch, onClose }: AppLauncherProps) {
  return (
    <>
      <div className="fixed inset-0 z-[9990] bg-background/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed z-[9991] top-12 left-4 os-window-body border border-border/60 rounded-xl shadow-2xl p-4 w-72">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-1">Applications</h3>
        <div className="grid grid-cols-3 gap-2">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => { onLaunch(app.id); onClose(); }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-primary/15 transition"
            >
              <app.icon className="w-8 h-8 text-primary/80" />
              <span className="text-[10px] text-foreground/80 text-center leading-tight">{app.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
