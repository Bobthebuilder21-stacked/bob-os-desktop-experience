import { useState } from "react";

export function BobTextEditor() {
  const [content, setContent] = useState("# Welcome to Bob Text Editor\n\nStart typing here...\n");
  const [filename, setFilename] = useState("untitled.txt");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 border-b border-border/40 text-xs">
        <input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-secondary/60 rounded px-2 py-0.5 text-foreground/80 outline-none focus:ring-1 focus:ring-primary/40 w-40"
        />
        <span className="text-muted-foreground">—</span>
        <span className="text-muted-foreground">{content.length} chars</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-os-terminal-bg text-foreground/90 font-mono text-xs p-3 resize-none outline-none"
        spellCheck={false}
      />
    </div>
  );
}
