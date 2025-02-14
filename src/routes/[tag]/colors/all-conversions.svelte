<script lang="ts">
  import type converts from "color-convert";

  import Color from "color";

  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card";
  import { roundFloat, successToast } from "$lib/utils";
  import { Label } from "$lib/components/ui/label";
  import { AdvancedInput } from "$lib/components/advanced-ui/input";
  import { AdvancedColorPicker } from "$lib/components/advanced-ui/color-picker";
  import type { ClickEvent } from "../../../types";

  let color = $state("#8683d5");
  let colorInstance = $derived(Color(color));

  let colorConversionError = $state("");

  const copyColor = (e?: ClickEvent<HTMLButtonElement>) => {
    e?.currentTarget?.blur();
    navigator.clipboard.writeText(color);
    successToast(`Copied to clipboard ${color}`);
  };

  const formatOutput = (color: Color<string>, model: keyof typeof converts) => {
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
</script>

<div class="flex gap-4">
  <Tabs.Root value="color-picker" class="w-[400px]">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="input">Input</Tabs.Trigger>
      <Tabs.Trigger value="color-picker">Color Picker</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="input">
      <Card.Root>
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
            bind:value={() => color,
            (v) => {
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
            }}
          />

          <Card.Description class="pt-1.5 pl-0.5">
            rgba/hexa/hsla/hsv/cmyk
          </Card.Description>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="color-picker">
      <Card.Root>
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

  <Card.Root class="h-fit flex-1">
    <Card.Header>
      <Card.Title class="text-2xl">Output</Card.Title>
    </Card.Header>

    <Card.Content class="flex gap-4">
      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">RGBA</Label>
        <AdvancedInput value={formatOutput(colorInstance, "rgb")} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">CMYK</Label>
        <AdvancedInput value={formatOutput(colorInstance, "cmyk")} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">HSLA</Label>
        <AdvancedInput value={formatOutput(colorInstance, "hsl")} readonly />
      </div>
    </Card.Content>

    <Card.Content class="flex gap-4 pt-0">
      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">HEX</Label>
        <AdvancedInput value={colorInstance.hex().toString()} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">HEXA</Label>
        <AdvancedInput value={colorInstance.hexa().toString()} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">HSV</Label>
        <AdvancedInput value={formatOutput(colorInstance, "hsv")} readonly />
      </div>
    </Card.Content>

    <Card.Content class="flex gap-4 pt-0">
      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">LCHA</Label>
        <AdvancedInput value={formatOutput(colorInstance, "lch")} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">LAB</Label>
        <AdvancedInput value={formatOutput(colorInstance, "lab")} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">HCGA</Label>
        <AdvancedInput value={formatOutput(colorInstance, "hcg")} readonly />
      </div>
    </Card.Content>

    <Card.Content class="flex gap-4 pt-0">
      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">ANSI16</Label>
        <AdvancedInput value={formatOutput(colorInstance, "ansi16")} readonly />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">ANSI256</Label>
        <AdvancedInput
          value={formatOutput(colorInstance, "ansi256")}
          readonly
        />
      </div>

      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85">HWBA</Label>
        <AdvancedInput value={formatOutput(colorInstance, "hwb")} readonly />
      </div>
    </Card.Content>
  </Card.Root>
</div>
