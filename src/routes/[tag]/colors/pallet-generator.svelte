<script lang="ts">
  import Color from "color";
  import { Button } from "$lib/components/ui/button";
  import { randHex } from "@ngneat/falso";
  import {
    generateRandomBalancedPalette,
    generateShades,
  } from "./color-pallets";
  import {
    Copy,
    LockOpen,
    Lock,
    RefreshCcw,
    SwatchBook,
    X,
    CopyCheck,
  } from "lucide-svelte";

  import { cn, successToast } from "$lib/utils";
  import PaletteButton from "$lib/components/advanced-ui/button/palette-button.svelte";

  type PaletteItem = {
    color: Color;
    backupColorForShade: Color;
    locked: boolean;
    order: number;
    isCopied: boolean;
    choosingShade: boolean;
  };

  let palette = $state<PaletteItem[]>(
    generateRandomBalancedPalette(5).map((e, i) => ({
      locked: false,
      color: e,
      backupColorForShade: e,
      order: i,
      isCopied: false,
      choosingShade: false,
    }))
  );

  let tempShades = $state<Color[]>([]);
  const isShadeChoosingMode = $derived.by(() => tempShades.length > 0);

  const regenerate = (existingColor?: string) => {
    if (existingColor) {
      const foundIndex = palette.findIndex(
        (e) => e.color.hex() === existingColor
      );
      if (foundIndex === -1) return;

      const newColor = Color(randHex());
      palette[foundIndex].color = newColor;
      palette[foundIndex].backupColorForShade = newColor;
      return;
    }

    palette = palette.slice().map((e) => {
      const newRandomColor = Color(randHex());
      const newColor = e.locked ? e.color : newRandomColor;

      return { ...e, color: newColor, backupColorForShade: newColor };
    });
  };

  const copyHex = (color: string, animation?: boolean) => {
    navigator.clipboard.writeText(color.toString());
    successToast(`Copied to clipboard ${color.toString()}`);

    if (animation) {
      const foundIndex = palette.findIndex((e) => e.color.hex() === color);
      if (foundIndex === -1) return;

      palette[foundIndex].isCopied = true;
      setTimeout(() => (palette[foundIndex].isCopied = false), 1500);
    }
  };

  const removeColor = (color: string) => {
    palette = palette.filter((item) => item.color.hex() !== color);
  };

  const lockColor = (color: string) => {
    const foundIndex = palette.findIndex((e) => e.color.hex() === color);
    if (foundIndex === -1) return;

    palette[foundIndex].locked = !palette[foundIndex].locked;
  };

  const onChoosingShade = (color: string) => {
    const foundIndex = palette.findIndex((e) => e.color.hex() === color);
    if (foundIndex === -1) return;

    palette[foundIndex].choosingShade = true;

    const colorForShade = palette[foundIndex].color;
    const backupColorForShade = palette[foundIndex].backupColorForShade;

    tempShades.length = 0;
    tempShades.push(...generateShades(colorForShade.hex()));
  };

  const chooseShade = (baseColor: string, newColor: string) => {
    tempShades.length = 0;

    const foundIndex = palette.findIndex((e) => e.color.hex() === baseColor);
    if (foundIndex === -1) return;

    palette[foundIndex].choosingShade = false;
    palette[foundIndex].color = Color(newColor);
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->

<div class="flex flex-col h-full gap-2">
  <div>
    <Button onclick={() => regenerate()} size="icon" variant="outline">
      <RefreshCcw />
    </Button>
  </div>

  <div class="h-screen flex flex-wrap">
    {#each palette as item}
      <div
        class="h-full min-h-full relative flex-1 overflow-hidden"
        style="background-color: {item.color.hex()}"
      >
        {#if !item.choosingShade}
          <div
            class="absolute bottom-10 left-1/2 -translate-x-1/2"
            onclick={() => copyHex(item.color.hex())}
            role="button"
            tabindex="0"
          >
            <h1
              class={cn(
                "text-nowrap text-2xl cursor-pointer active:scale-50 transition-all select-none",
                item.color.isLight() ? "text-black" : "text-white"
              )}
            >
              {item.color.hex()}
            </h1>
          </div>

          {#if !isShadeChoosingMode}
            <div
              class="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col gap-6"
            >
              <PaletteButton
                colorHex={item.color.hex()}
                onclick={() => removeColor(item.color.hex())}
              >
                <X size={22} />
              </PaletteButton>

              <PaletteButton
                colorHex={item.color.hex()}
                onclick={() => regenerate(item.color.hex())}
              >
                <RefreshCcw size={20} />
              </PaletteButton>

              <PaletteButton
                colorHex={item.color.hex()}
                onclick={() => onChoosingShade(item.color.hex())}
              >
                <SwatchBook size={20} strokeWidth={1.7} />
              </PaletteButton>

              <PaletteButton
                colorHex={item.color.hex()}
                onclick={() => copyHex(item.color.hex(), true)}
              >
                {#if item.isCopied}
                  <CopyCheck size={20} />
                {:else}
                  <Copy size={20} />
                {/if}
              </PaletteButton>

              <PaletteButton
                colorHex={item.color.hex()}
                onclick={() => lockColor(item.color.hex())}
              >
                {#if item.locked}
                  <Lock size={20} />
                {:else}
                  <LockOpen size={20} />
                {/if}
              </PaletteButton>
            </div>
          {/if}
        {:else}
          <div
            class="absolute bottom-10 left-0 right-0 top-0 flex-1 flex flex-col"
          >
            {#each tempShades as shade}
              <div
                role="button"
                tabindex="0"
                style="background-color: {shade.hex()}"
                class="w-full cursor-pointer hover:border transition-all flex-1"
                onclick={() => chooseShade(item.color.hex(), shade.hex())}
              ></div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<!--TODO
<PaletteButton colorHex={item.color.hex()} class="cursor-grab active:cursor-grabbing focus-visible:cursor-grabbing">
  <MoveHorizontal size={20} />
</PaletteButton> 
-->
