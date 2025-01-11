<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";

  let greetMsg = $state("");
</script>

<main>
  <h1>{greetMsg}</h1>
  <Button onclick={() => (greetMsg = "Hello button clicked")}>Hello</Button>
</main>
