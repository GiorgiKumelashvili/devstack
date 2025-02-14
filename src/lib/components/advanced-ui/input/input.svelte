<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  import { toast } from "svelte-sonner";
  import { Copy, CopyCheck } from "lucide-svelte";

  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import type { ClickEvent } from "../../../../types";

  type Props = HTMLInputAttributes & {
    value: string;
    setErrorMessage?: string;
  };

  let {
    value = $bindable(),
    setErrorMessage = $bindable(),
    ...props
  }: Props = $props();

  let copyClick = $state(false);

  const copyColor = (e?: ClickEvent<HTMLButtonElement>) => {
    e?.currentTarget?.blur();
    navigator.clipboard.writeText(value);
    toast.info("Copied to clipboard", {
      position: "top-right",
      dismissable: true,
      cancel: { label: "Close" },
    });
  };

  const clickCopyButton = () => {
    if (copyClick) {
      return;
    }

    copyClick = !copyClick;
    copyColor();

    setTimeout(() => {
      copyClick = false;
    }, 1500);
  };
</script>

<div class="relative">
  <Input {...props} bind:value class="pr-8" />

  {#if setErrorMessage}
    <p class="text-red-600">{setErrorMessage}</p>
  {/if}

  <Button
    variant="ghost"
    size="icon"
    class="h-7 w-7 absolute top-1/2 -translate-y-1/2 right-1"
    onclick={clickCopyButton}
  >
    {#if copyClick}
      <CopyCheck
        class="h-[0.5rem] w-[0.5rem] rotate-0 scale-55 transition-all"
      />
    {:else}
      <Copy class="h-[0.5rem] w-[0.5rem] rotate-0 scale-55 transition-all" />
    {/if}

    <span class="sr-only">Toggle theme</span>
  </Button>
</div>
