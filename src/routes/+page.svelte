<script lang="ts">
  import { goto } from "$app/navigation";
  import { Boxes, PaintBucket } from "lucide-svelte";

  import * as Card from "$lib/components/ui/card/index.js";
</script>

<div class="flex gap-3">
  <Card.Root
    class="w-28 h-28 cursor-pointer hover:bg-primary/10 select-none"
    onclick={() => goto("/all-conversions")}
  >
    <Card.Header>
      <PaintBucket />
      <Card.Description>All Conversion</Card.Description>
    </Card.Header>
  </Card.Root>

  <Card.Root
    class="w-28 h-28 cursor-pointer hover:bg-primary/10 select-none"
    onclick={() => goto("/icons-all")}
  >
    <Card.Header>
      <Boxes />
      <Card.Description>All Icons</Card.Description>
    </Card.Header>
  </Card.Root>
</div>
