import wallpaperDefault from "@/assets/wallpaper.jpg";
import wallpaperForest from "@/assets/wallpaper-forest.jpg";
import wallpaperSunset from "@/assets/wallpaper-sunset.jpg";
import wallpaperOcean from "@/assets/wallpaper-ocean.jpg";
import wallpaperMountains from "@/assets/wallpaper-mountains.jpg";
import wallpaperGeo from "@/assets/wallpaper-geo.jpg";
import wallpaperAurora from "@/assets/wallpaper-aurora.jpg";
import wallpaperCity from "@/assets/wallpaper-city.jpg";

export interface WallpaperOption {
  id: string;
  name: string;
  src: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  { id: "default", name: "Aurora Waves", src: wallpaperDefault },
  { id: "forest", name: "Night Forest", src: wallpaperForest },
  { id: "sunset", name: "Sunset Flow", src: wallpaperSunset },
  { id: "ocean", name: "Deep Ocean", src: wallpaperOcean },
  { id: "mountains", name: "Mountain Dawn", src: wallpaperMountains },
  { id: "geo", name: "Geometric", src: wallpaperGeo },
  { id: "aurora", name: "Northern Lights", src: wallpaperAurora },
  { id: "city", name: "Neon City", src: wallpaperCity },
];

export function getWallpaperSrc(id: string): string {
  return WALLPAPERS.find((w) => w.id === id)?.src ?? wallpaperDefault;
}
