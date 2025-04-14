import { Boxes, PaintBucket, PencilRuler, Type, VenetianMask } from "lucide-svelte";
import { getIfDesktop } from "$lib/utils";
import { isDevMode } from "../env";
import type { UtilItem, UtilSubItem } from "../types";

export const utilItems: UtilItem[] = $state([
  ...!isDevMode ? [] : [
    {
      title: "DevModeOnly",
      url: "#",
      tag: 'onlydev',
      icon: VenetianMask,
      isActive: true,
      items: [
        {
          title: "Page Overflow Check",
          url: "page-overflow-check",
          tag: 'page-overflow-check'
        },
        {
          title: "Color Palette Gen Advanced",
          url: "color-palette-generator-dev",
          tag: 'color-palette-generator-dev'
        }
      ]
    },
  ],
  {
    title: "Text",
    url: "#",
    tag: "text",
    icon: Type,
    isActive: true,
    items: [
      {
        title: "Text Information",
        url: "text-information",
        tag: "text-information",
      },
      {
        title: "Text Diff",
        url: "text-diff",
        tag: "text-diff",
      },
      ...getIfDesktop<UtilSubItem>({
        title: "Text ASCII",
        url: "text-ascii",
        tag: "text-ascii",
      })
    ],
  },
  {
    title: "Colors",
    url: "#",
    tag: "color",
    icon: PaintBucket,
    isActive: true,
    items: [
      {
        title: "Color Information",
        url: "color-information",
        tag: "color-information",
      },
      {
        title: "Color Palette Generator",
        url: "color-palette-generator",
        tag: "color-palette-generator",
      },
    ],
  },
  {
    title: "Icons",
    url: "#",
    tag: "icons",
    icon: Boxes,
    isActive: true,
    items: [
      {
        title: "All",
        url: "icons-all",
        tag: "icons-all",
      },
    ],
  },
  {
    title: "Conversions",
    url: "#",
    tag: "conversions",
    icon: PencilRuler,
    // icon: SendToBack,
    isActive: true,
    items: [
      {
        title: "Json Yaml Csv",
        url: "json-yaml-csv",
        tag: "json-yaml-csv",
      },
    ],
  },
]);

export const findTagTitle = (tagName?: string): string | undefined => {
  if (!tagName) return;

  return utilItems
    .map((e) => e.items)
    .flat()
    .filter(Boolean)
    .find((item) => item.tag === tagName)?.title;
};
