import { isTauri } from "@tauri-apps/api/core";
import { type Event } from "@tauri-apps/api/event";
import { twMerge } from "tailwind-merge";
import { browser } from "$app/environment";
import { type ClassValue, clsx } from "clsx";
import { toast } from "svelte-sonner";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type { IpcResponse } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseIpcPayload = <T = string>(
  event: Event<string>,
): IpcResponse<T> => {
  return JSON.parse(event.payload) as IpcResponse<T>;
};

export const isDesktop = browser ? isTauri() : true;

export const getIfDesktop = <T>(value: T): T[] => {
  if (isDesktop) {
    return [value];
  }

  return [];
};

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number],
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    return percentage * (maxB - minB) + minB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>,
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export function roundFloat(value: number, precision: number) {
  return Math.round(value * 10 ** precision) / 10 ** precision;
}

export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    dismissable: true,
    cancel: { label: "Close" },
  });
};

export const regex = {
  /**
   * Matches words containing only letters from any language.
   *
   * ```md
   * - \p{L}+ → Matches letters from any language.
   * - g → Finds all matches (global).
   * - u → Enables Unicode support.
   * ```
   *
   * **Example Usage:**
   * ```js
   * const text = "Hello, 世界! Привет 123 Café.";
   * const words = text.match(regex.allLetter) || [];
   * console.log(words); // ["Hello", "世界", "Привет", "Café"]
   * ```
   */
  globalAllLetter: new RegExp(/\p{L}+/gu),

  /**
   * Matches all numeric digits (0-9) in the text.
   *
   * ```md
   * - \d+ → Matches one or more numeric digits.
   * - g → Finds all matches (global).
   * ```
   *
   * **Example Usage:**
   * ```js
   * const text = "Price: 123 dollars, 456 cents.";
   * const numbers = text.match(regex.numeric) || [];
   * console.log(numbers.length); // 2 (["123", "456"])
   * ```
   */
  numeric: new RegExp(/\d+/g),

  /**
   * Matches all symbols (non-alphanumeric characters, excluding spaces).
   *
   * ```md
   * - [^\p{L}\d\s]+ → Matches anything that is NOT a letter, digit, or space.
   * - g → Finds all matches (global).
   * - u → Enables Unicode support.
   * ```
   *
   * **Example Usage:**
   * ```js
   * const text = "Hello! @World# 2024.";
   * const symbols = text.match(regex.symbols) || [];
   * console.log(symbols.length); // 3 (["!", "@", "#"])
   * ```
   */
  symbols: new RegExp(/[^\p{L}\d\s]+/gu),

  /**
   * Matches non-blank lines in a string (ignores lines that are only whitespace).
   *
   * ```md
   * - ^ → Anchors the match to the start of each line.
   * - (?!\s*$) → Negative lookahead that excludes lines that are only whitespace.
   * - .+ → Matches one or more characters that are not blank.
   * - g → Global flag to find all matches.
   * - m → Multiline flag to treat ^ and $ as line-start and line-end anchors.
   * ```
   *
   * **Example Usage:**
   * ```js
   * const value = "Hello\n\nWorld\n\nThis is a test";
   * const lineCount = (value.match(regex.nonBlankLines) || []).length;
   * console.log(lineCount); // Output: 4
   * ```
   */
  nonBlankLines: new RegExp(/^(?!\s*$).+/gm),
};


export  const downloadSvg= (name: string, body: string)=> {
  const svgBlob = new Blob([body], {type:"image/svg+xml;charset=utf-8"});
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = `${name}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}