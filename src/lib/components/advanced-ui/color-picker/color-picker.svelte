<script lang="ts">
  import { ColorPickerWrapper } from "$lib/components/advanced-ui/color-picker";
  import ColorPicker from "svelte-awesome-color-picker";

  type Props = {
    hex: string;
  };

  let { hex = $bindable() }: Props = $props();
</script>

<div class="dark">
  <ColorPicker
    bind:hex
    components={{ wrapper: ColorPickerWrapper as any }}
    sliderDirection="horizontal"
    isDialog={false}
    --slider-width="20px"
    --picker-indicator-size="12px"
    --picker-z-index="10"
  />
</div>
