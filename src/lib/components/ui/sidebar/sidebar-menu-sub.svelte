<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { WithElementRef } from "bits-ui";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
  bind:this={ref}
  data-sidebar="menu-sub"
  class={cn(
    "border-sidebar-border flex min-w-0 translate-x-px flex-col gap-1",
    "group-data-[collapsible=icon]:hidden",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ul>
