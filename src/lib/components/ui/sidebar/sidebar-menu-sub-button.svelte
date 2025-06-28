<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { WithElementRef } from "bits-ui";
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    children,
    class: className,
    size = "md",
    isActive,
    ...restProps
  }: WithElementRef<HTMLAnchorAttributes> & {
    child?: Snippet<[{ props: Record<string, unknown> }]>;
    size?: "sm" | "md";
    isActive?: boolean;
  } = $props();

  const mergedProps = $derived({
    class: cn(
      // "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground  focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
      // "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground text-sm",
      // "group-data-[collapsible=icon]:hidden",

      "flex items-center rounded-none! text-sm gap-2 p-2 pl-8 h-8 cursor-pointer",
      "rounded-md font-light transition-all ease-in-out duration-150",
      className,
    ),
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    ...restProps,
  });
</script>

<a bind:this={ref} {...mergedProps}>
  {@render children?.()}
</a>
