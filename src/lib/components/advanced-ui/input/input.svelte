<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  import { Input } from "$lib/components/ui/input";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { cn } from "$lib/utils";

  type Value = string | number | boolean;
  type Props = HTMLInputAttributes & {
    value: Value;
    setErrorMessage?: string;
  };

  let {
    value = $bindable<string>(),
    setErrorMessage = $bindable(),
    class: className,
    ...props
  }: Props = $props();
</script>

<div class="relative">
  <Input {...props} bind:value class={cn("pr-8", className)} />

  {#if setErrorMessage}
    <p class="text-red-600">{setErrorMessage}</p>
  {/if}

  <CopyIconButton
    opt2Value={value}
    class="absolute top-1/2 -translate-y-1/2 right-1"
  />
</div>
