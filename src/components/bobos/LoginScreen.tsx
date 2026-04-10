import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { StatusIndicators } from "./StatusIndicators";
import avatar from "@/assets/avatar.png";

interface LoginScreenProps {
  battery: number;
  formattedTime: string;
  formattedDate: string;
  onLogin: () => void;
}

const PASSWORD = "bobos123";

export function LoginScreen({ battery, formattedTime, formattedDate, onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      onLogin();
    } else {
      setError("Incorrect password for Bob OS. Try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 os-desktop-bg flex flex-col items-center justify-center select-none">
      {/* Top status bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-2 os-panel/60">
        <span className="text-sm text-foreground/60 font-medium">Bob OS</span>
        <StatusIndicators battery={battery} formattedTime={formattedTime} formattedDate={formattedDate} />
      </div>

      {/* Login box */}
      <div
        className={`flex flex-col items-center gap-5 transition-transform ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        style={shake ? { animation: "shake 0.4s ease-in-out" } : {}}
      >
        <img
          src={avatar}
          alt="Bob OS User"
          className="w-24 h-24 rounded-full ring-2 ring-primary/40"
        />
        <h2 className="text-xl font-bold text-foreground">bob</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-72">
          <div className="relative w-full">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Password"
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition"
          >
            Log In
          </button>
          {error && (
            <p className="text-destructive text-xs text-center">{error}</p>
          )}
        </form>
        <p className="text-xs text-muted-foreground mt-2">Password: bobos123</p>
      </div>
    </div>
  );
}
