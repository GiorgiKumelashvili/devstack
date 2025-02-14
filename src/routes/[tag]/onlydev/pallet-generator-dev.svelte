<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input";
  import { AdvancedColorPicker } from "$lib/components/advanced-ui/color-picker";
  import {
    ColorScheme,
    generateComplementary,
    generateAnalogous,
    generateTriadic,
    generateTetradic,
    generateSplitComplementary,
    generateMonochromatic,
    exampleColorPalettes,
  } from "../colors/color-pallets";

  const colorSchemes: { value: ColorScheme; label: string }[] = [
    { value: ColorScheme.COMPLEMENTARY, label: "Complementary" },
    { value: ColorScheme.ANALOGOUS, label: "Analogous" },
    { value: ColorScheme.TRIADIC, label: "Triadic" },
    { value: ColorScheme.TETRADIC, label: "Tetradic" },
    { value: ColorScheme.SPLIT_COMPLEMENTARY, label: "Split Complementary" },
    { value: ColorScheme.MONOCHROMATIC, label: "Monochromatic" },
  ];

  // Example usage:
  let baseColor = $state("#3498db"); // Base color in hex format
  let numberOfColors = $state(5); // Desired number of colors in the palette
  let scheme = $state<ColorScheme>(ColorScheme.ANALOGOUS);

  const triggerContent = $derived(
    colorSchemes.find((f) => f.value === scheme)?.label ?? "Select scheme color"
  );

  const palett2 = $derived.by(() => {
    switch (scheme) {
      case ColorScheme.COMPLEMENTARY:
        return generateComplementary(baseColor);
      case ColorScheme.ANALOGOUS:
        return generateAnalogous(baseColor, numberOfColors);
      case ColorScheme.TRIADIC:
        return generateTriadic(baseColor);
      case ColorScheme.TETRADIC:
        return generateTetradic(baseColor);
      case ColorScheme.SPLIT_COMPLEMENTARY:
        return generateSplitComplementary(baseColor);
      case ColorScheme.MONOCHROMATIC:
        return generateMonochromatic(baseColor, numberOfColors);
      default:
        return [];
    }
  });
</script>

<br />

<div class="flex">
  <div>
    <Input type="number" bind:value={numberOfColors} />
    <Input type="text" bind:value={baseColor} />
    <Select.Root type="single" name="favoriteFruit" bind:value={scheme}>
      <Select.Trigger class="w-[180px]">
        {triggerContent}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.GroupHeading>Type</Select.GroupHeading>
          {#each colorSchemes as fruit}
            <Select.Item value={fruit.value} label={fruit.label} />
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  </div>

  <div class="w-64">
    <AdvancedColorPicker bind:hex={baseColor} />
  </div>
</div>

<br />
<p class="text-xl">generateColorPalette2</p>
<hr />
<br />
{JSON.stringify(palett2)}

<div class="flex">
  {#each palett2 as item}
    <div class="h-9 w-9" style="background-color: {item}"></div>
  {/each}
</div>

<br />
<p class="text-xl">Examples</p>
<hr />
<br />

<div>
  {#each exampleColorPalettes as pallet}
    <div class="flex mt-3 w-fit border border-white">
      {#each pallet as color}
        <div class="h-9 w-9" style="background-color: {color}"></div>
      {/each}
    </div>
  {/each}
</div>
