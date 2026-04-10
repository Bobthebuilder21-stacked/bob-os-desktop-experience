import { useState, useRef, useEffect, type FormEvent } from "react";

const FILESYSTEM: Record<string, string[]> = {
  "~": ["Documents", "Downloads", "Pictures", "Music", ".bashrc", "README.md"],
  "~/Documents": ["notes.txt", "report.pdf", "project/"],
  "~/Downloads": ["bob-os-1.0.iso", "wallpaper.png"],
  "~/Pictures": ["screenshot.png", "avatar.png"],
  "~/Music": ["chill-vibes.mp3"],
};

export function BobTerminal() {
  const [history, setHistory] = useState<string[]>([
    "Welcome to Bob OS Terminal v1.0",
    'Type "help" for available commands.',
    "",
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const exec = (cmd: string): string[] => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1).join(" ");

    switch (command) {
      case "help":
        return ["Available commands: help, ls, cd, echo, pwd, clear, whoami, uname, date, neofetch"];
      case "ls":
        return FILESYSTEM[cwd]?.map((f) => `  ${f}`) ?? ["ls: cannot access"];
      case "cd": {
        const target = args || "~";
        const resolved = target === ".." ? "~" : target.startsWith("~/") ? target : `${cwd}/${target}`;
        if (FILESYSTEM[resolved]) {
          setCwd(resolved);
          return [];
        }
        return [`cd: no such directory: ${target}`];
      }
      case "pwd":
        return [`/home/bob/${cwd === "~" ? "" : cwd.replace("~/", "")}`];
      case "echo":
        return [args];
      case "whoami":
        return ["bob"];
      case "uname":
        return ["Bob OS 1.0.0 x86_64 GNU/Linux"];
      case "date":
        return [new Date().toString()];
      case "clear":
        setHistory([]);
        return [];
      case "neofetch":
        return [
          "       ____        _      ___  ____  ",
          "      | __ )  ___ | |__  / _ \\/ ___| ",
          "      |  _ \\ / _ \\| '_ \\| | | \\___ \\ ",
          "      | |_) | (_) | |_) | |_| |___) |",
          "      |____/ \\___/|_.__/ \\___/|____/ ",
          "",
          `  OS: Bob OS 1.0`,
          `  Kernel: 6.8.0-bobos`,
          `  Shell: bob-sh 1.0`,
          `  Resolution: ${window.innerWidth}x${window.innerHeight}`,
          `  DE: Bob Desktop Environment`,
          `  Terminal: Bob Terminal`,
        ];
      default:
        return command ? [`${command}: command not found`] : [];
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const prompt = `bob@bob-os:${cwd}$ ${input}`;
    const output = exec(input);
    setHistory((h) => [...h, prompt, ...output]);
    setInput("");
  };

  return (
    <div className="os-terminal h-full flex flex-col p-3 text-xs leading-relaxed overflow-auto">
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-1">
        <span className="text-primary shrink-0">bob@bob-os:{cwd}$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none caret-primary"
          autoFocus
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
