import type { Icon } from "lucide-svelte";

export type UtilItem = {
  title: string;
  url: string;
  isActive?: boolean;
  items?: UtilSubItem[];
  icon: typeof Icon;
};

export type UtilSubItem = {
  title: string;
  url: string;
};
