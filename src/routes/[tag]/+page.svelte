<script lang="ts">
  import { page } from "$app/state";
  import type { SvelteComponent } from "svelte";
  import type { ComponentMap, GenericCallback } from "../../types";
  import { isDevMode } from "../../env";
  import { CircleAlert } from "lucide-svelte";

  const tagImports: ComponentMap = {
    "all-conversions": () => import("./colors/all-conversions.svelte"),
    "palette-generator": () => import("./colors/palette-generator.svelte"),
    "icons-all": () => import("./icons/icons-all.svelte"),

    ...(isDevMode && {
      "page-overflow-check": () =>
        import("./onlydev/page-overflow-check.svelte"),
      "palette-generator-dev": () =>
        import("./onlydev/palette-generator-dev.svelte"),
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
