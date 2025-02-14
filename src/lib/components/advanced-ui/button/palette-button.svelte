<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils.js";
  import type { ButtonProps } from "$lib/components/ui/button";
  import Color from "color";

  type Props = ButtonProps & {
    children: Snippet;
    class?: string;
    colorHex: string;
  };

  const { children, class: className, colorHex, ...props }: Props = $props();

  const isLight = $derived(Color(colorHex).isLight());
</script>

<button
  {...props}
  class={cn(
    "flex items-center justify-center w-9 h-9 rounded-md",
    isLight ? "hover:bg-black/10 text-black" : "hover:bg-primary/20 text-white",
    className
  )}
>
  {@render children()}
</button>
