
export interface Font {
  family: string;
  chineseName?: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  description?: string;
  designer?: string;
  license?: string;
  copyright?: string;
  source?: string;
  features?: string;  // 特点
  scenarios?: string; // 适用场景
}

export interface FontPairing {
  heading: string;
  body: string;
  reason: string;
  vibe: string;
}

export interface User {
  username: string;
  avatarColor: string;
  createdAt: string;
}

export enum Category {
  SANS_SERIF = 'sans-serif',
  SERIF = 'serif',
  DISPLAY = 'display',
  HANDWRITING = 'handwriting',
  MONOSPACE = 'monospace',
}
