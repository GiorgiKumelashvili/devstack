import type { Icon } from "lucide-svelte";

// only place any allowed
export type GenericCallback<T> = new (...args: any[]) => T;

export type ComponentMap = {
  [key: string]: () => Promise<{ default: any }>;
};

export type UtilItem = {
  title: string;
  url: string;
  isActive?: boolean;
  items?: UtilSubItem[];
  icon: typeof Icon;
  tag: string;
};

export type UtilSubItem = {
  title: string;
  url: string;
  tag: string;
};
