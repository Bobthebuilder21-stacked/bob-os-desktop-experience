import { WALLPAPERS } from "./wallpapers";

export function BobImageViewer() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1.5 bg-secondary/40 border-b border-border/40 text-xs text-muted-foreground">
        Sample Images
      </div>
      <div className="flex-1 overflow-auto p-3 grid grid-cols-2 gap-2">
        {WALLPAPERS.slice(0, 4).map((wp) => (
          <div key={wp.id} className="rounded-lg overflow-hidden">
            <img src={wp.src} alt={wp.name} className="w-full h-28 object-cover" />
            <p className="text-[10px] text-muted-foreground text-center py-1">{wp.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
