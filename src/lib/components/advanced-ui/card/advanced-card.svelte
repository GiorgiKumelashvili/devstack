<script lang="ts">
  import { type Snippet } from "svelte";
  import { X } from "lucide-svelte";

  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { cn, exists } from "$lib/utils";
  import CopyIconButton, {
    type CustomIconButtonProps,
  } from "$lib/components/advanced-ui/button/copy-icon-button.svelte";

  type Props = {
    title?: string;
    titleContent?: Snippet;
    bellowContent?: Snippet;
    children?: Snippet;
    onClear?: () => void;
    additionalButtons?: Snippet;
    class?: string;
    contentClass?: string;
  } & CustomIconButtonProps;

  let {
    title,
    titleContent,
    class: className,
    contentClass,
    children,
    onClear,
    additionalButtons,
    bellowContent,
    defaultDimenstions,
    opt1IsCopyIconActive,
    opt2Value,
    opt3Callback,
  }: Props = $props();

  const copyIconExists =
    exists(opt1IsCopyIconActive) || exists(opt2Value) || exists(opt3Callback);
</script>

<Card.Root class={cn("flex flex-col", className)}>
  {#if exists(title) || exists(titleContent)}
    <Card.Header
      class="flex-row items-center justify-between p-3 pb-0 space-y-0"
    >
      {@render titleContent?.()}

      {#if exists(title)}
        <Card.Title class="text-xl">{title}</Card.Title>
      {/if}

      {#if !!onClear || !!copyIconExists || !!additionalButtons}
        <div class="flex gap-1">
          <div class="pr-2">
            {#if !!additionalButtons}
              {@render additionalButtons?.()}
            {/if}
          </div>

          {#if copyIconExists}
            <CopyIconButton
              {defaultDimenstions}
              {opt1IsCopyIconActive}
              {opt2Value}
              {opt3Callback}
            />
          {/if}

          {#if !!onClear}
            <Button
              variant="ghost"
              size="icon"
              class="h-7 w-7"
              onclick={onClear}
            >
              <X strokeWidth={1.5} viewBox="3 3 18 18" />
            </Button>
          {/if}
        </div>
      {/if}
    </Card.Header>
  {/if}

  {#if exists(children)}
    <Card.Content class={cn("flex-1 overflow-scroll p-3", contentClass)}>
      {@render children?.()}
    </Card.Content>
  {/if}

  {@render bellowContent?.()}
</Card.Root>
