export type AppId = "terminal" | "files" | "browser" | "settings" | "texteditor" | "imageviewer" | "wallpaperpicker";

export interface WindowState {
  id: string; // unique instance id
  appId: AppId;
  title: string;
  zIndex: number;
  minimized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
}
