import { useState, type FormEvent } from "react";
import { User } from "lucide-react";
import { StatusIndicators } from "./StatusIndicators";

interface AuthScreenProps {
  battery: number;
  formattedTime: string;
  formattedDate: string;
  onLogin: (username: string) => Promise<{ error: string | null }>;
}

export function AuthScreen({ battery, formattedTime, formattedDate, onLogin }: AuthScreenProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) { setError("Enter a username"); return; }
    if (trimmed.length < 2) { setError("Username must be at least 2 characters"); return; }

    setError("");
    setLoading(true);
    const { error: err } = await onLogin(trimmed);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 os-desktop-bg flex flex-col items-center justify-center select-none">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-2 os-panel/60">
        <span className="text-sm text-foreground/60 font-medium">Bob OS</span>
        <StatusIndicators battery={battery} formattedTime={formattedTime} formattedDate={formattedDate} />
      </div>

      <div
        className={`flex flex-col items-center gap-5 transition-transform ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        style={shake ? { animation: "shake 0.4s ease-in-out" } : {}}
      >
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/40">
          <User className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Welcome to Bob OS</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-72">
          <div className="relative w-full">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              placeholder="Enter your username"
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          {error && <p className="text-destructive text-xs text-center">{error}</p>}
        </form>
        <p className="text-xs text-muted-foreground mt-2">Just pick a username to get started</p>
      </div>
    </div>
  );
}
