import PaintBucket from "lucide-svelte/icons/paint-bucket";
import type { UtilItem } from "../types";
import { Boxes, VenetianMask } from "lucide-svelte";
import { isDevMode } from "../env";

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
          title: "palette Gen Advanced",
          url: "palette-generator-dev",
          tag: 'palette-generator-dev'
        }
      ]
    },
  ],
  {
    title: "Colors",
    url: "#",
    tag: "color",
    icon: PaintBucket,
    isActive: true,
    items: [
      {
        title: "All Conversions",
        url: "all-conversions",
        tag: "all-conversions",
      },
      {
        title: "palette generator",
        url: "palette-generator",
        tag: "palette-generator",
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
]);

export const findTagTitle = (tagName?: string): string | undefined => {
  if (!tagName) return;

  return utilItems
    .map((e) => e.items)
    .flat()
    .filter(Boolean)
    .find((item) => item.tag === tagName)?.title;
};
