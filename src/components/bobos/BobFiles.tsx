import { useState } from "react";
import { Folder, FileText, Image, Music, Home, Download, File } from "lucide-react";

const FOLDERS: Record<string, { name: string; icon: "folder" | "file" | "image" | "music" }[]> = {
  Home: [
    { name: "Documents", icon: "folder" },
    { name: "Downloads", icon: "folder" },
    { name: "Pictures", icon: "folder" },
    { name: "Music", icon: "folder" },
    { name: "README.md", icon: "file" },
  ],
  Documents: [
    { name: "notes.txt", icon: "file" },
    { name: "report.pdf", icon: "file" },
    { name: "project", icon: "folder" },
  ],
  Downloads: [
    { name: "bob-os-1.0.iso", icon: "file" },
    { name: "wallpaper.png", icon: "image" },
  ],
  Pictures: [
    { name: "screenshot.png", icon: "image" },
    { name: "avatar.png", icon: "image" },
  ],
  Music: [
    { name: "chill-vibes.mp3", icon: "music" },
  ],
};

const SIDEBAR = ["Home", "Documents", "Downloads", "Pictures", "Music"];
const ICON_MAP = { folder: Folder, file: FileText, image: Image, music: Music };
const SIDEBAR_ICONS: Record<string, typeof Home> = { Home, Documents: Folder, Downloads: Download, Pictures: Image, Music };

export function BobFiles() {
  const [active, setActive] = useState("Home");
  const files = FOLDERS[active] ?? [];

  return (
    <div className="flex h-full text-sm">
      {/* Sidebar */}
      <div className="w-44 shrink-0 bg-secondary/40 border-r border-border/40 py-2">
        {SIDEBAR.map((name) => {
          const Icon = SIDEBAR_ICONS[name] ?? Folder;
          return (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`w-full flex items-center gap-2 px-4 py-1.5 text-left text-xs transition
                ${active === name ? "bg-primary/20 text-primary" : "text-foreground/70 hover:bg-secondary/60"}`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </button>
          );
        })}
      </div>
      {/* Main */}
      <div className="flex-1 p-4 overflow-auto">
        <h3 className="text-xs text-muted-foreground mb-3 font-medium">{active}</h3>
        <div className="grid grid-cols-4 gap-4">
          {files.map((f) => {
            const Icon = ICON_MAP[f.icon] ?? File;
            return (
              <div
                key={f.name}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition"
                onDoubleClick={() => f.icon === "folder" && FOLDERS[f.name] && setActive(f.name)}
              >
                <Icon className="w-8 h-8 text-primary/80" />
                <span className="text-xs text-foreground/80 text-center truncate w-full">{f.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
