import PaintBucket from "lucide-svelte/icons/paint-bucket";
import type { UtilItem } from "../types";

export const utilItems: UtilItem[] = $state([
  {
    title: "Color",
    url: "#",
    icon: PaintBucket,
    isActive: true,
    items: [
      {
        title: "All Conversions",
        url: "all-converions",
      },
      // {
      //   title: "Starred",
      //   url: "#",
      // },
      // {
      //   title: "Settings",
      //   url: "#",
      // },
    ],
  },
  // {
  //   title: "Documentation",
  //   url: "#",
  //   icon: BookOpen,
  //   items: [
  //     {
  //       title: "Introduction",
  //       url: "#",
  //     },
  //     {
  //       title: "Get Started",
  //       url: "#",
  //     },
  //     {
  //       title: "Tutorials",
  //       url: "#",
  //     },
  //     {
  //       title: "Changelog",
  //       url: "#",
  //     },
  //   ],
  // },
]);
