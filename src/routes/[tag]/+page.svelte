<script lang="ts">
  import { page } from "$app/state";
  import type { SvelteComponent } from "svelte";
  import type { ComponentMap, GenericCallback } from "../../types";

  const tagImports: ComponentMap = {
    "all-conversions": () => import("./colors/all-conversions.svelte"),
    "pallet-generator": () => import("./colors/pallet-generator.svelte"),
    "icons-all": () => import("./icons/icons-all.svelte"),
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
</script>

<div>{page.params.tag}</div>
<hr />

{#if Component}
  <Component />
{:else}
  <p>Loading or invalid component...</p>
{/if}
