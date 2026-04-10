import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { AuthScreen } from "@/components/bobos/AuthScreen";
import { Desktop } from "@/components/bobos/Desktop";

const Index = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { settings, updateSettings, loaded } = useUserSettings(user);
  const { battery, formattedTime, formattedDate } = useSystemStatus();
  const [transitioning, setTransitioning] = useState(false);

  if (loading || (user && !loaded)) {
    return (
      <div className="fixed inset-0 os-desktop-bg flex items-center justify-center">
        <div className="text-primary text-lg font-semibold animate-pulse">Bob OS</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={transitioning ? { animation: "fadeOut 0.5s ease-out forwards" } : undefined}>
        <AuthScreen
          battery={battery}
          formattedTime={formattedTime}
          formattedDate={formattedDate}
          onSignIn={signIn}
          onSignUp={signUp}
        />
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.6s ease-out" }}>
      <Desktop
        battery={battery}
        formattedTime={formattedTime}
        formattedDate={formattedDate}
        wallpaper={settings.wallpaper}
        onWallpaperChange={(id) => updateSettings({ wallpaper: id })}
        user={user}
        onSignOut={signOut}
      />
    </div>
  );
};

export default Index;
