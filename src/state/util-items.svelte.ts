import { Boxes, CircleEllipsis, PaintBucket, PencilRuler, Type, TypeOutline, VenetianMask } from "lucide-svelte";
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
        },
        {
          title: "JSON Format Test",
          url: "json-format-test",
          tag: 'json-format-test'
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
    title: "Format",
    url: "#",
    tag: "color",
    icon: TypeOutline,
    isActive: true,
    items: [
      {
        title: "JSON format",
        url: "json-format",
        tag: "json-format",
      },
      {
        title: "YAML format",
        url: "yaml-format",
        tag: "yaml-format",
      },
      {
        title: "HTML format",
        url: "html-format",
        tag: "html-format",
      },
      {
        title: "CSS, SCSS, LESS format",
        url: "css-format",
        tag: "css-format",
      },
      {
        title: "Markdown format",
        url: "markdown-format",
        tag: "markdown-format",
      },
      {
        title: "SQL format",
        url: "sql-format",
        tag: "sql-format",
      }
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
    isActive: true,
    items: [
      {
        title: "Json Yaml Csv",
        url: "json-yaml-csv",
        tag: "json-yaml-csv",
      },
    ],
  },
  {
    title: "Misc",
    url: "#",
    tag: "misc",
    icon: CircleEllipsis,
    isActive: true,
    items: [
      {
        title: "JWT",
        url: "jwt",
        tag: "jwt",
      },
      {
        title: "UUID",
        url: "uuid",
        tag: "uuid",
      },
      {
        title: "QR Code",
        url: "qr",
        tag: "qr",
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
