<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  import { Input } from "$lib/components/ui/input";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";

  type Props = HTMLInputAttributes & {
    value: string | number | boolean;
    setErrorMessage?: string;
  };

  let {
    value = $bindable<string>(),
    setErrorMessage = $bindable(),
    ...props
  }: Props = $props();
</script>

<div class="relative">
  <Input {...props} bind:value class="pr-8" />

  {#if setErrorMessage}
    <p class="text-red-600">{setErrorMessage}</p>
  {/if}

  <CopyIconButton
    opt2Value={value}
    class="absolute top-1/2 -translate-y-1/2 right-1"
  />
</div>
