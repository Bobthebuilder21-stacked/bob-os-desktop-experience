import { WALLPAPERS, type WallpaperOption } from "./wallpapers";

interface WallpaperPickerProps {
  current: string;
  onSelect: (id: string) => void;
}

export function WallpaperPicker({ current, onSelect }: WallpaperPickerProps) {
  return (
    <div className="p-4 overflow-auto h-full">
      <h3 className="text-sm font-semibold text-foreground mb-3">Choose Wallpaper</h3>
      <div className="grid grid-cols-3 gap-3">
        {WALLPAPERS.map((wp: WallpaperOption) => (
          <button
            key={wp.id}
            onClick={() => onSelect(wp.id)}
            className={`rounded-lg overflow-hidden border-2 transition ${
              current === wp.id ? "border-primary" : "border-transparent hover:border-primary/40"
            }`}
          >
            <img src={wp.src} alt={wp.name} className="w-full h-20 object-cover" />
            <div className="text-[10px] text-foreground/70 py-1 text-center">{wp.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
