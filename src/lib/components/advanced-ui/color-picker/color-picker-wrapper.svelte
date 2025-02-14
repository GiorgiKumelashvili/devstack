<script lang="ts">
  interface Props {
    wrapper?: HTMLDivElement | undefined;
    isOpen?: boolean;
    isDialog?: boolean;
    children?: any;
  }

  let { wrapper = $bindable(), isOpen, isDialog, children }: Props = $props();
</script>

<div
  class="wrapper"
  bind:this={wrapper}
  class:is-open={isOpen}
  role={isDialog ? "dialog" : undefined}
  aria-label="color picker"
>
  {@render children?.()}
</div>

<style>
  /* TODO fix for light mode */

  .wrapper :global {
    input,
    button {
      @apply bg-transparent ring-1 ring-input !outline-none placeholder:text-muted-foreground focus-visible:ring-ring;
    }

    button {
      @apply bg-primary text-primary-foreground hover:bg-primary/90 shadow;
    }
  }

  .wrapper {
    @apply bg-card text-card-foreground h-fit flex-1 w-full rounded-[9px];

    --picker-width: 100%;
    --text-input-margin: 5px;
  }

  .is-open {
    display: flex;
    flex-direction: column;
  }

  [role="dialog"] {
    position: absolute;
    top: calc(var(--input-size, 25px) + 12px);
    left: 0;
    z-index: var(--picker-z-index, 2);
  }

  div:not([role="dialog"]) {
    display: inline-flex;
    flex-direction: column;
  }
</style>
