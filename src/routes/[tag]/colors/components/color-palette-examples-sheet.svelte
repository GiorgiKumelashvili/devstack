<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { buttonVariants } from "$lib/components/ui/button";
  import { Palette } from "lucide-svelte";
  import { exampleColorPalettes } from "../utils/color-palette";
  import { cn, successToast } from "$lib/utils";
  import type { ClickAllEvent } from "../../../../types";

  const copyColor = (e: ClickAllEvent, palette: string[]) => {
    e.currentTarget.blur();
    const value = `[${palette.map((e) => `"${e}"`).join(",")}]`;
    navigator.clipboard.writeText(value);
    successToast("Copied to clipboard");
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->

<Sheet.Root>
  <Sheet.Trigger class={buttonVariants({ variant: "outline" })}>
    <Palette />
    Explore
  </Sheet.Trigger>

  <Sheet.Content side="right" class="p-0 flex flex-col gap-0 sm:max-w-xs">
    <Sheet.Header class="p-6">
      <Sheet.Title>Popular Combinations</Sheet.Title>
    </Sheet.Header>

    <div class="overflow-y-auto p-6 pt-0 flex flex-col gap-3">
      {#each exampleColorPalettes as palette}
        <div
          class="flex w-full cursor-pointer active:scale-75 transition-all"
          onclick={(e) => copyColor(e, palette)}
          role="button"
        >
          {#each palette as color, i}
            <div
              class={cn(
                "h-10 w-12",
                i === 0 && "rounded-l-xl",
                i === palette.length - 1 && "rounded-r-xl"
              )}
              style="background-color: {color}"
            ></div>
          {/each}
        </div>
      {/each}
    </div>
  </Sheet.Content>
</Sheet.Root>
