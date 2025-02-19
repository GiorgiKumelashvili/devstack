<script lang="ts">
  import type Color from "color";

  import * as Card from "$lib/components/ui/card";
  import { cn, successToast } from "$lib/utils";

  import type { ClickAllEvent, ClickButtonEvent } from "../../../../types";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";

  type Props = {
    title: string;
    hexValues: Color[];
    cardClass?: string;
  };

  type CopyColorParams = {
    value: string;
    e?: ClickAllEvent;
    customMsg?: string;
  };

  let { hexValues, title, cardClass }: Props = $props();
  let copyClick = $state(false);

  const copyColor = ({ value, e, customMsg }: CopyColorParams) => {
    e?.currentTarget?.blur();
    navigator.clipboard.writeText(value);
    successToast(customMsg ?? `Copied to clipboard ${value}`);
  };

  const clickCopyButton = (e: ClickButtonEvent) => {
    if (copyClick) {
      return;
    }

    copyClick = !copyClick;

    copyColor({
      e,
      customMsg: "Copied to clipboard",
      value: `[${hexValues.map((e) => `"${e.hex()}"`).join(",")}]`,
    });

    setTimeout(() => {
      copyClick = false;
    }, 1500);
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->

<Card.Root class={cn("flex flex-col", cardClass)}>
  <Card.Header>
    <Card.Title class="text-2xl flex items-center gap-1">
      <p>{title}</p>
      <CopyIconButton onclick={clickCopyButton} isCopyIconActive={copyClick} />
    </Card.Title>
  </Card.Header>

  <Card.Content class="flex flex-col justify-between gap-2 h-full">
    {#each hexValues as item}
      <div
        class={cn(
          "flex-1 border rounded-lg p-1 font-mono font-medium cursor-pointer flex justify-center items-center focus-visible:scale-75 active:scale-75 transition-all select-none",
          item.isDark() ? "text-white" : "text-black"
        )}
        style={`background-color: ${item.hex()}`}
        onclick={(e) => copyColor({ e, value: item.hex() })}
        role="button"
        tabindex="0"
      >
        {item.hex()}
      </div>
    {/each}
  </Card.Content>
</Card.Root>
