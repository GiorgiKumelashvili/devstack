<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { invoke } from "@tauri-apps/api/core";

  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }
</script>

<main>
  <h1>{greetMsg}</h1>
  <Button onclick={greet}>Hello</Button>
</main>
