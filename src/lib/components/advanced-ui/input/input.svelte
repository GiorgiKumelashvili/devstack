<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { toast } from "svelte-sonner";

  import { Input } from "$lib/components/ui/input";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";

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

  <CopyIconButton
    onclick={clickCopyButton}
    isCopyIconActive={copyClick}
    class="absolute top-1/2 -translate-y-1/2 right-1"
  />
</div>
