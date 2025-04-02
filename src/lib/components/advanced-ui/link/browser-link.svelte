<script lang="ts">
  import { cn } from "$lib/utils";
  import { openUrl } from "@tauri-apps/plugin-opener";
  import type { Snippet } from "svelte";

  type Props = {
    url: string;
    class?: string;
    children: Snippet;
  };

  let { class: className, url, children }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<p
  class={cn("inline-block underline text-blue-500 cursor-pointer", className)}
  onclick={() => openUrl(url)}
>
  {@render children?.()}
</p>
