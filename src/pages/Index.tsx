import { useState } from "react";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { LoginScreen } from "@/components/bobos/LoginScreen";
import { Desktop } from "@/components/bobos/Desktop";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const { battery, formattedTime, formattedDate } = useSystemStatus();

  const handleLogin = () => {
    setTransitioning(true);
    setTimeout(() => setLoggedIn(true), 600);
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {loggedIn ? (
        <div style={{ animation: "fadeIn 0.6s ease-out" }}>
          <Desktop battery={battery} formattedTime={formattedTime} formattedDate={formattedDate} />
        </div>
      ) : (
        <div style={transitioning ? { animation: "fadeOut 0.5s ease-out forwards" } : undefined}>
          <LoginScreen
            battery={battery}
            formattedTime={formattedTime}
            formattedDate={formattedDate}
            onLogin={handleLogin}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
