import type { Icon } from "lucide-svelte";

// only place any allowed
export type GenericCallback<T> = new (...args: any[]) => T;

export type EitherVal<T> = { value: T | null, error: string | null };



export type IpcResponse<T = string> = {
  data?: T;
  error: IpcError
}

export type IpcError = {
  message: string;
}


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

export type ClickEvent<T = HTMLDivElement> = MouseEvent & { currentTarget: EventTarget & T }
export type ClickButtonEvent = ClickEvent<HTMLButtonElement> | ClickEvent<HTMLAnchorElement>
export type ClickAllEvent = ClickButtonEvent | ClickEvent<HTMLDivElement>;