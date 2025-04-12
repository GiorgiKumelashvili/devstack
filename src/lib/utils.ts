import { browser } from "$app/environment";
import { isTauri } from "@tauri-apps/api/core";
import { type Event } from "@tauri-apps/api/event";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { type ClassValue, clsx } from "clsx";
import { toast } from "svelte-sonner";
import { twMerge } from "tailwind-merge";

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

export const download = async (
  filename: string,
  body: string,
  type: "svg" | "txt",
) => {
  let finalObjProps: { name: string; type: string };

  switch (type) {
    case "svg":
      finalObjProps = {
        name: filename + ".svg",
        type: "image/svg+xml;charset=utf-8",
      };
      break;
    case "txt":
      finalObjProps = {
        name: filename + ".txt",
        type: "text/plain;charset=utf-8",
      };
      break;
    default:
      finalObjProps = {
        name: filename + ".txt",
        type: "text/plain;charset=utf-8",
      };
  }

  console.log('='.repeat(20));
  console.log('isDesktop', isDesktop)

  if (isDesktop) {
    const filePath = await save({ defaultPath: finalObjProps.name });

    if (!filePath) {
      return;
    }

    const svgUint8Array = new TextEncoder().encode(body);
    await writeFile(filePath, svgUint8Array);
  } else {
    const blob = new Blob([body], { type: finalObjProps.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalObjProps.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
