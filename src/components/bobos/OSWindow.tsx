import { useState, useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { X, Minus, Square } from "lucide-react";

interface OSWindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const SNAP_THRESHOLD = 16;

function getSnapZone(clientX: number, clientY: number): { x: number; y: number; w: number; h: number } | null {
  const sw = window.innerWidth;
  const sh = window.innerHeight - 40; // panel height
  if (clientX <= SNAP_THRESHOLD) {
    if (clientY <= SNAP_THRESHOLD + 40) return { x: 0, y: 0, w: sw / 2, h: sh / 2 };
    if (clientY >= sh + 40 - SNAP_THRESHOLD) return { x: 0, y: sh / 2, w: sw / 2, h: sh / 2 };
    return { x: 0, y: 0, w: sw / 2, h: sh };
  }
  if (clientX >= sw - SNAP_THRESHOLD) {
    if (clientY <= SNAP_THRESHOLD + 40) return { x: sw / 2, y: 0, w: sw / 2, h: sh / 2 };
    if (clientY >= sh + 40 - SNAP_THRESHOLD) return { x: sw / 2, y: sh / 2, w: sw / 2, h: sh / 2 };
    return { x: sw / 2, y: 0, w: sw / 2, h: sh };
  }
  if (clientY <= 40 + SNAP_THRESHOLD) return { x: 0, y: 0, w: sw, h: sh };
  return null;
}

export function OSWindow({
  title,
  icon,
  children,
  x,
  y,
  w,
  h,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  onResize,
}: OSWindowProps) {
  const [maximized, setMaximized] = useState(false);
  const [preMax, setPreMax] = useState({ x, y, w, h });
  const [snapPreview, setSnapPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleTitleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (maximized) return;
      onFocus();
      dragging.current = true;
      dragOffset.current = { x: e.clientX - x, y: e.clientY - y };

      const handleMouseMove = (ev: globalThis.MouseEvent) => {
        if (!dragging.current) return;
        onMove(ev.clientX - dragOffset.current.x, ev.clientY - dragOffset.current.y);
        const snap = getSnapZone(ev.clientX, ev.clientY);
        setSnapPreview(snap);
      };
      const handleMouseUp = (ev: globalThis.MouseEvent) => {
        dragging.current = false;
        const snap = getSnapZone(ev.clientX, ev.clientY);
        if (snap) {
          onMove(snap.x, snap.y);
          onResize(snap.w, snap.h);
        }
        setSnapPreview(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [x, y, maximized, onFocus, onMove, onResize]
  );

  const handleEdgeMouseDown = useCallback(
    (e: MouseEvent, edge: Edge) => {
      e.stopPropagation();
      onFocus();
      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = { x, y, w, h };

      const handleMouseMove = (ev: globalThis.MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let newX = startPos.x, newY = startPos.y, newW = startPos.w, newH = startPos.h;

        if (edge.includes("e")) newW = Math.max(300, startPos.w + dx);
        if (edge.includes("w")) { newW = Math.max(300, startPos.w - dx); newX = startPos.x + dx; }
        if (edge.includes("s")) newH = Math.max(200, startPos.h + dy);
        if (edge.includes("n")) { newH = Math.max(200, startPos.h - dy); newY = startPos.y + dy; }

        onMove(newX, newY);
        onResize(newW, newH);
      };
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [x, y, w, h, onFocus, onMove, onResize]
  );

  const toggleMaximize = () => {
    if (maximized) {
      onMove(preMax.x, preMax.y);
      onResize(preMax.w, preMax.h);
    } else {
      setPreMax({ x, y, w, h });
      onMove(0, 0);
      onResize(window.innerWidth, window.innerHeight - 40);
    }
    setMaximized(!maximized);
  };

  return (
    <>
      {snapPreview && (
        <div
          className="fixed border-2 border-primary/50 bg-primary/10 rounded-lg z-[9997] pointer-events-none transition-all duration-150"
          style={{ left: snapPreview.x, top: snapPreview.y + 40, width: snapPreview.w, height: snapPreview.h }}
        />
      )}
      <div
        className="absolute rounded-lg overflow-hidden shadow-2xl shadow-black/40 flex flex-col border border-border/50"
        style={{ left: x, top: y, width: w, height: h, zIndex }}
        onMouseDown={onFocus}
      >
        {/* Resize edges */}
        {!maximized && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize z-10" onMouseDown={(e) => handleEdgeMouseDown(e, "n")} />
            <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize z-10" onMouseDown={(e) => handleEdgeMouseDown(e, "s")} />
            <div className="absolute top-0 bottom-0 left-0 w-1 cursor-w-resize z-10" onMouseDown={(e) => handleEdgeMouseDown(e, "w")} />
            <div className="absolute top-0 bottom-0 right-0 w-1 cursor-e-resize z-10" onMouseDown={(e) => handleEdgeMouseDown(e, "e")} />
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-20" onMouseDown={(e) => handleEdgeMouseDown(e, "nw")} />
            <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-20" onMouseDown={(e) => handleEdgeMouseDown(e, "ne")} />
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-20" onMouseDown={(e) => handleEdgeMouseDown(e, "sw")} />
            <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-20" onMouseDown={(e) => handleEdgeMouseDown(e, "se")} />
          </>
        )}

        {/* Title bar */}
        <div
          className="os-window-titlebar flex items-center justify-between px-3 py-1.5 cursor-grab active:cursor-grabbing select-none shrink-0"
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={toggleMaximize}
        >
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            {icon}
            <span className="font-medium truncate max-w-[300px]">{title}</span>
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
    </>
  );
}
