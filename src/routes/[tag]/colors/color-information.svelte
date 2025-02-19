<script lang="ts">
  import type converts from "color-convert";
  import Color from "color";

  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";
  import { AdvancedInput } from "$lib/components/advanced-ui/input";
  import { AdvancedColorPicker } from "$lib/components/advanced-ui/color-picker";
  import { roundFloat, successToast } from "$lib/utils";

  import type { ClickEvent } from "../../../types";
  import ColorInformationCard from "./components/color-information-card.svelte";
  import {
    generateAnalogous,
    generateComplementary,
    generateMonochromatic,
    generateSplitComplementary,
    generateTetradic,
    generateTriadic,
  } from "./utils/color-palette";

  type ColorModel = keyof typeof converts | "hexa";

  let color = $state("#8683d5");
  let colorInstance = $derived(Color(color));

  let colorConversionError = $state("");

  const copyColor = (e?: ClickEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(color);
    successToast(`Copied to clipboard ${color}`);
  };

  const setColor = (v: string) => {
    colorConversionError = "";

    // necessary to be before setting new color
    try {
      Color(v);
    } catch (error) {
      console.log("*".repeat(20));
      console.log(error);
      colorConversionError = "Invalid color code";
    }

    // necessary to update input, otherwise it causes weird behavior
    color = v;
  };

  const formatOutput = (color: Color<string>, model: ColorModel) => {
    if (model === "hex") return color.hex().toString();
    if (model === "hexa") return color.hexa().toString();

    const specificColor = color[model]() as Color<string>;
    const arr = specificColor.array();

    const [first, second, third, vAlpha] = [
      Math.round(arr[0]),
      Math.round(arr[1]),
      Math.round(arr[2]),
      roundFloat(color.alpha(), 2),
    ];

    switch (model) {
      case "rgb":
        return `rgba(${first}, ${second}, ${third}, ${vAlpha})`;
      case "cmyk":
        return `cmyk(${first}%, ${second}%, ${third}%, ${Math.round(color.black())}%)`;
      case "hsl":
        return `hsla(${first}, ${second}%, ${third}%, ${vAlpha})`;
      case "hsv":
        return `hsva(${first}, ${second}%, ${third}%, ${vAlpha})`;
      case "hcg":
        return `hcga(${first}, ${second}%, ${third}%, ${vAlpha})`;
      case "hwb":
        return `hwba(${first}, ${second}%, ${third}%, ${vAlpha})`;
      case "lch":
        return `lcha(${first}%, ${second}, ${third}, ${vAlpha})`;
      case "lab":
        return `laba(${first}%, ${second}, ${third}, ${vAlpha})`;
      case "ansi16":
      case "ansi256":
        return first.toString();
      default:
        throw new Error("Invalid model");
    }
  };

  const analogous = $derived(generateAnalogous(color));
  const monochromatic = $derived(generateMonochromatic(color));
  const complementary = $derived(generateComplementary(color));
  const splitComplementary = $derived(generateSplitComplementary(color));
  const triadic = $derived(generateTriadic(color));
  const tetradic = $derived(generateTetradic(color));
</script>

{#snippet ColorInputItem({
  title,
  model,
}: {
  title: string;
  model: ColorModel;
})}
  <div class="flex-1">
    <Label class="block pb-1.5 opacity-85 font-bold text-red-400">
      {title}
    </Label>
    <AdvancedInput value={formatOutput(colorInstance, model)} readonly />
  </div>
{/snippet}

<div class="flex gap-4">
  <Tabs.Root value="color-picker" class="w-[400px]">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="input">Input</Tabs.Trigger>
      <Tabs.Trigger value="color-picker">Color Picker</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="input">
      <Card.Root class="h-[420px]">
        <div class="flex p-6 pb-0 flex-row justify-between">
          <div class="flex flex-col">
            <Card.Title>Input color code</Card.Title>
            <Card.Description class="pt-1.5">
              Multiple color spaces are supported
            </Card.Description>
          </div>

          <button
            class="w-10 h-10 cursor-pointer rounded-sm hover:opacity-80 focus:opacity-60 active:opacity-60"
            style={`background-color: ${colorInstance.hexa().toString()}`}
            onclick={copyColor}
            type="button"
            aria-label="Copy to clipboard"
          >
          </button>
        </div>

        <Card.Content>
          <AdvancedInput
            bind:setErrorMessage={colorConversionError}
            bind:value={() => color, (v) => setColor(v)}
          />

          <Card.Description class="pt-1.5 pl-0.5">
            rgba/hexa/hsla/hsv/cmyk
          </Card.Description>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="color-picker">
      <Card.Root class="h-[420px]">
        <Card.Header>
          <Card.Title>Picker</Card.Title>
        </Card.Header>

        <Card.Content>
          <div class="dark">
            <AdvancedColorPicker bind:hex={color} />
          </div>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>

  <Card.Root class="flex-1">
    <Card.Header>
      <Card.Title class="text-2xl">Output</Card.Title>
    </Card.Header>

    <Card.Content class="flex gap-4">
      {@render ColorInputItem({ title: "RGBA", model: "rgb" })}
      {@render ColorInputItem({ title: "CMYK", model: "cmyk" })}
      {@render ColorInputItem({ title: "HSLA", model: "hsl" })}
    </Card.Content>

    <Card.Content class="flex gap-4 pt-0">
      {@render ColorInputItem({ title: "HEX", model: "hex" })}
      {@render ColorInputItem({ title: "HEXA", model: "hexa" })}
      {@render ColorInputItem({ title: "HSV", model: "hsv" })}
    </Card.Content>

    <Card.Content class="flex gap-4 pt-0">
      {@render ColorInputItem({ title: "LCHA", model: "lch" })}
      {@render ColorInputItem({ title: "LAB", model: "lab" })}
      {@render ColorInputItem({ title: "HCGA", model: "hcg" })}
    </Card.Content>

    <Card.Content class="flex gap-4 pt-0">
      {@render ColorInputItem({ title: "ANSI16", model: "ansi16" })}
      {@render ColorInputItem({ title: "ANSI256", model: "ansi256" })}
      {@render ColorInputItem({ title: "HWBA", model: "hwb" })}
    </Card.Content>
  </Card.Root>
</div>

<div class="flex gap-4 mt-4">
  <ColorInformationCard
    cardClass="w-[400px]"
    hexValues={analogous}
    title="Analogous"
  />

  <ColorInformationCard
    cardClass="flex-1"
    hexValues={monochromatic}
    title="Monochromatic"
  />

  <ColorInformationCard
    cardClass="flex-1"
    hexValues={complementary}
    title="Complementary"
  />
</div>

<div class="flex gap-4 mt-4">
  <ColorInformationCard
    cardClass="w-[400px]"
    hexValues={splitComplementary}
    title="Split Complementary"
  />

  <ColorInformationCard
    cardClass="flex-1"
    hexValues={triadic}
    title="Triadic"
  />

  <ColorInformationCard
    cardClass="flex-1"
    hexValues={tetradic}
    title="Tetradic"
  />
</div>
