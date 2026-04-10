import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserSettings {
  wallpaper: string;
  open_windows: string[];
  preferences: Record<string, unknown>;
}

const DEFAULT_SETTINGS: UserSettings = {
  wallpaper: "default",
  open_windows: ["browser"],
  preferences: {},
};

export function useUserSettings(user: User | null) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!user) { setLoaded(false); return; }

    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSettings({
            wallpaper: data.wallpaper ?? "default",
            open_windows: (data.open_windows as string[]) ?? ["browser"],
            preferences: (data.preferences as Record<string, unknown>) ?? {},
          });
        }
        setLoaded(true);
      });
  }, [user]);

  const updateSettings = useCallback(
    (partial: Partial<UserSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...partial };
        if (user) {
          if (saveTimeout.current) clearTimeout(saveTimeout.current);
          saveTimeout.current = setTimeout(() => {
            supabase
              .from("user_settings")
              .update({
                wallpaper: next.wallpaper,
                open_windows: next.open_windows as unknown as import("@/integrations/supabase/types").Json,
                preferences: next.preferences as unknown as import("@/integrations/supabase/types").Json,
              })
              .eq("user_id", user.id)
              .then(() => {});
          }, 1000);
        }
        return next;
      });
    },
    [user]
  );

  return { settings, updateSettings, loaded };
}
