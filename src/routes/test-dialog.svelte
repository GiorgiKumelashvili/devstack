<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { ask, confirm, message, open } from "@tauri-apps/plugin-dialog";

  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }

  async function askHello() {
    const answer = await ask("This action cannot be reverted. Are you sure?", {
      title: "Tauri",
      kind: "warning",
    });

    console.log("=".repeat(20));
    console.log(answer);
  }

  async function askConfirm() {
    const confirmation = await confirm(
      "This action cannot be reverted. Are you sure?",
      { title: "Tauri", kind: "warning" }
    );

    console.log("=".repeat(20));
    console.log(confirmation);
  }

  async function showMessage() {
    await message("File not found", { title: "Tauri", kind: "error" });
  }

  async function openFileDialog() {
    const file = await open({
      multiple: false,
      directory: false,
    });

    console.log(file);
  }
</script>

<main>
  <h1>{greetMsg}</h1>
  <Button onclick={greet}>Hello</Button>
  <Button onclick={askHello}>Ask</Button>
  <Button onclick={askConfirm}>Confirm</Button>
  <Button onclick={showMessage}>Message</Button>
  <Button onclick={openFileDialog}>Open File</Button>
</main>
