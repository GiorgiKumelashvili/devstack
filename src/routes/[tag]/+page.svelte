<script lang="ts">
  import { page } from "$app/stores";

  const { tag } = $page.params as { tag: string };
</script>

<div>{tag}</div>

<style>
</style>
