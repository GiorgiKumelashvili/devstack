<script lang="ts">
  import { Copy, CopyCheck } from "lucide-svelte";
  import { Button, type ButtonProps } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";

  type Props = ButtonProps & {
    isCopyIconActive?: boolean;
  };

  let { isCopyIconActive, class: className, ...props }: Props = $props();
</script>

<Button variant="ghost" size="icon" class={cn("h-7 w-7", className)} {...props}>
  {#if isCopyIconActive}
    <CopyCheck class="h-[0.5rem] w-[0.5rem] rotate-0 scale-55 transition-all" />
  {:else}
    <Copy class="h-[0.5rem] w-[0.5rem] rotate-0 scale-55 transition-all" />
  {/if}

  <span class="sr-only">Toggle theme</span>
</Button>
