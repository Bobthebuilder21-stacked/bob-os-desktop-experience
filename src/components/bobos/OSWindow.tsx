import { useState, useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { X, Minus, Square } from "lucide-react";

interface OSWindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  initialW?: number;
  initialH?: number;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}

export function OSWindow({
  title,
  icon,
  children,
  initialX = 120,
  initialY = 60,
  initialW = 700,
  initialH = 450,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
}: OSWindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ w: initialW, h: initialH });
  const [maximized, setMaximized] = useState(false);
  const [preMax, setPreMax] = useState({ pos: { x: initialX, y: initialY }, size: { w: initialW, h: initialH } });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (maximized) return;
      onFocus();
      dragging.current = true;
      dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

      const handleMove = (ev: globalThis.MouseEvent) => {
        if (!dragging.current) return;
        setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y });
      };
      const handleUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [pos, maximized, onFocus]
  );

  const toggleMaximize = () => {
    if (maximized) {
      setPos(preMax.pos);
      setSize(preMax.size);
    } else {
      setPreMax({ pos, size });
      setPos({ x: 0, y: 0 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 40 });
    }
    setMaximized(!maximized);
  };

  return (
    <div
      className="absolute rounded-lg overflow-hidden shadow-2xl shadow-black/40 flex flex-col border border-border/50"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="os-window-titlebar flex items-center justify-between px-3 py-1.5 cursor-grab active:cursor-grabbing select-none shrink-0"
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMinimize} className="p-1 rounded hover:bg-secondary/60 text-foreground/50 hover:text-foreground/80 transition">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button onClick={toggleMaximize} className="p-1 rounded hover:bg-secondary/60 text-foreground/50 hover:text-foreground/80 transition">
            <Square className="w-3 h-3" />
          </button>
          <button onClick={onClose} className="p-1 rounded hover:bg-destructive/80 text-foreground/50 hover:text-destructive-foreground transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="os-window-body flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
