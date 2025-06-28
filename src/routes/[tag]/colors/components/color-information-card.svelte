<script lang="ts">
  import type Color from "color";

  import { cn, successToast } from "$lib/utils";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  import { type ClickAllEvent } from "../../../../types";

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

  const copyColor = ({ value, e, customMsg }: CopyColorParams) => {
    e?.currentTarget?.blur();
    navigator.clipboard.writeText(value);
    successToast(customMsg ?? `Copied to clipboard ${value}`);
  };

  let hexValuesToString = $derived.by(() => {
    return `[${hexValues.map((e) => `"${e.hex()}"`).join(", ")}]`;
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->

<AdvancedCard
  {title}
  opt2Value={hexValuesToString}
  class={cn("flex flex-col", cardClass)}
>
  <div class="flex flex-col justify-between gap-2 h-full">
    {#each hexValues as item}
      <div
        class={cn(
          "flex-1 border rounded-lg p-1 font-mono font-medium cursor-pointer flex justify-center items-center focus-visible:scale-75 active:scale-75 transition-all select-none",
          item.isDark() ? "text-white" : "text-black",
        )}
        style={`background-color: ${item.hex()}`}
        onclick={(e) => copyColor({ e, value: item.hex() })}
        role="button"
        tabindex="0"
      >
        {item.hex()}
      </div>
    {/each}
  </div>
</AdvancedCard>
