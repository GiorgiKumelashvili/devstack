<script lang="ts">
  import { AdvancedInput } from "$lib/components/advanced-ui/input";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils";
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = HTMLInputAttributes & {
    title?: string;
    nextToTitle?: Snippet;
    value: string | number | undefined;
    readonly?: boolean;
    foreGroundText?: string;
    erroMsg?: string;
  };

  let {
    title,
    nextToTitle,
    value = $bindable(""),
    foreGroundText,
    erroMsg,
    readonly = true,
    ...props
  }: Props = $props();

  // TODO move this inside advanced input
</script>

<div class="flex-1">
  {#if title}
    <div class={cn("flex items-center gap-1.5 pb-1.5")}>
      <Label class="block opacity-85 font-bold text-red-400">
        {title}
      </Label>

      {@render nextToTitle?.()}
    </div>
  {/if}

  <AdvancedInput
    {...props}
    bind:value
    {readonly}
    class={cn({ "border border-red-500": !!erroMsg })}
  />

  {#if erroMsg}
    <p class="text-sm text-red-500 pt-0.5">{erroMsg}</p>
  {/if}

  {#if foreGroundText}
    <p class="text-muted-foreground text-sm">{foreGroundText}</p>
  {/if}
</div>
