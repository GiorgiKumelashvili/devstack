<script lang="ts">
  import { type Snippet } from "svelte";
  import { browser } from "$app/environment";

  import { cn } from "$lib/utils";

  type Props = {
    url: string;
    class?: string;
    children: Snippet;
  };

  let { class: className, url, children }: Props = $props();

  async function handleClick() {
    if (!browser) {
      console.warn("Cannot open URL outside of a browser environment.");
      return;
    }

    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url); // openUrl might be async, good to await it
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<p
  onclick={handleClick}
  class={cn("inline-block underline text-blue-500 cursor-pointer", className)}
>
  {@render children?.()}
</p>
