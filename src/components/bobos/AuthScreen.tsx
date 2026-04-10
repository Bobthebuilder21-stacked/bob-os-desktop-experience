import { useState, type FormEvent } from "react";
import { Lock, Mail, User } from "lucide-react";
import { StatusIndicators } from "./StatusIndicators";

interface AuthScreenProps {
  battery: number;
  formattedTime: string;
  formattedDate: string;
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
}

export function AuthScreen({ battery, formattedTime, formattedDate, onSignIn, onSignUp }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error: err } = await onSignIn(email, password);
      if (err) setError(err.message);
    } else {
      if (!username.trim()) { setError("Username is required"); setLoading(false); return; }
      const { error: err } = await onSignUp(email, password, username);
      if (err) setError(err.message);
      else setSuccess("Check your email to confirm your account, or sign in if auto-confirm is enabled.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 os-desktop-bg flex flex-col items-center justify-center select-none">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-2 os-panel/60">
        <span className="text-sm text-foreground/60 font-medium">Bob OS</span>
        <StatusIndicators battery={battery} formattedTime={formattedTime} formattedDate={formattedDate} />
      </div>

      <div className="flex flex-col items-center gap-4 w-80">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {mode === "login" ? "Welcome to Bob OS" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>
          {error && <p className="text-destructive text-xs text-center">{error}</p>}
          {success && <p className="text-primary text-xs text-center">{success}</p>}
        </form>

        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
}
