import { User, Palette, LogOut, Monitor } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";

interface BobSettingsProps {
  user: AuthUser | null;
  onSignOut: () => void;
  onChangeWallpaper: () => void;
}

export function BobSettings({ user, onSignOut, onChangeWallpaper }: BobSettingsProps) {
  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Monitor className="w-4 h-4" /> Bob OS Settings
      </h3>

      <div className="space-y-3">
        <div className="bg-secondary/40 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <User className="w-3.5 h-3.5" /> Account
          </div>
          <p className="text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</p>
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition mt-1"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>

        <div className="bg-secondary/40 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <Palette className="w-3.5 h-3.5" /> Appearance
          </div>
          <button
            onClick={onChangeWallpaper}
            className="text-xs text-primary hover:text-primary/80 transition"
          >
            Change Wallpaper →
          </button>
        </div>

        <div className="bg-secondary/40 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Bob OS v1.0.0</p>
          <p className="text-xs text-muted-foreground">Kernel: 6.8.0-bobos</p>
          <p className="text-xs text-muted-foreground">DE: Bob Desktop Environment</p>
        </div>
      </div>
    </div>
  );
}
