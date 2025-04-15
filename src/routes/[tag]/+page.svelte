<script lang="ts">
  import { page } from "$app/state";
  import type { SvelteComponent } from "svelte";
  import type { ComponentMap, GenericCallback } from "../../types";
  import { isDevMode } from "../../env";
  import { CircleAlert } from "lucide-svelte";
  import { isDesktop } from "$lib/utils";

  const tagImports: ComponentMap = {
    "color-information": () => import("./colors/color-information.svelte"),
    "color-palette-generator": () =>
      import("./colors/color-palette-generator.svelte"),
    "icons-all": () => import("./icons/icons-all.svelte"),
    "text-information": () => import("./texts/text-information.svelte"),
    "text-diff": () => import("./texts/text-diff.svelte"),
    "json-yaml-csv": () => import("./conversions/json-yaml-csv.svelte"),
    uuid: () => import("./misc/uuid.svelte"),

    ...(isDesktop && {
      "text-ascii": () => import("./texts/text-ascii.svelte"),
    }),

    ...(isDevMode && {
      "page-overflow-check": () =>
        import("./onlydev/page-overflow-check.svelte"),
      "color-palette-generator-dev": () =>
        import("./onlydev/color-palette-generator-dev.svelte"),
    }),
  };

  $effect(() => {
    if (page.params.tag) {
      loadComponent(page.params.tag);
    }
  });

  let Component = $state<GenericCallback<SvelteComponent> | null>(null);

  // Function to dynamically load the component
  async function loadComponent(tag: string) {
    try {
      const module = await tagImports?.[tag]?.();
      Component = module.default;
    } catch (error) {
      console.error(`Failed to load component for tag "${tag}":`, error);
      Component = null; // Handle error gracefully
    }
  }

  let showElse = $state(false);

  $effect(() => {
    showElse = false;

    setTimeout(() => {
      showElse = true;
    }, 1000);
  });
</script>

<!-- <div>{page.params.tag}</div>
<hr /> -->

{#if Component}
  <Component />
{:else if showElse}
  <p class="flex gap-3 items-center">
    <CircleAlert />
    Loading issue
  </p>
{/if}
