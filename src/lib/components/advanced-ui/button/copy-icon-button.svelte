<script lang="ts">
  import { Copy, CopyCheck } from "lucide-svelte";
  import { Button, type ButtonProps } from "$lib/components/ui/button";
  import { cn, successToast } from "$lib/utils";

  type Props = ButtonProps & {
    defaultDimenstions?: boolean;

    // this is do your own
    opt1IsCopyIconActive?: boolean;

    // this is from component
    opt2Value?: string;

    // this is modifying underlying logic
    opt3Callback?: () => void;
  };

  let {
    opt1IsCopyIconActive,
    opt2Value,
    opt3Callback,
    onclick,

    class: className,
    defaultDimenstions = false,
    ...props
  }: Props = $props();

  let isCopyIconActuallyActive = $state(opt1IsCopyIconActive ?? false);

  const onClickInside = () => {
    if (isCopyIconActuallyActive) {
      return;
    }

    isCopyIconActuallyActive = !isCopyIconActuallyActive;

    if (opt3Callback) {
      opt3Callback();
    } else if (opt2Value && opt2Value.toString().trim() !== "") {
      navigator.clipboard.writeText(opt2Value);
      successToast("Copied to clipboard");
    }

    setTimeout(() => {
      isCopyIconActuallyActive = false;
    }, 1500);
  };
</script>

<Button
  variant="ghost"
  size="icon"
  class={cn(!defaultDimenstions && "h-7 w-7", className)}
  onclick={onclick !== undefined ? onclick : onClickInside}
  {...props}
>
  {#if isCopyIconActuallyActive}
    <CopyCheck class="h-[0.5rem] w-[0.5rem] rotate-0 scale-55 transition-all" />
  {:else}
    <Copy class="h-[0.5rem] w-[0.5rem] rotate-0 scale-55 transition-all" />
  {/if}

  <span class="sr-only">Copy button</span>
</Button>
