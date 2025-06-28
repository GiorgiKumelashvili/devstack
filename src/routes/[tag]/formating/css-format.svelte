<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as cssPlugin from "prettier/plugins/postcss.js";

  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { EditorView, placeholder } from "@codemirror/view";
  import { abcdef } from "@uiw/codemirror-themes-all";
  import { css } from "@codemirror/lang-css";
  import { sass } from "@codemirror/lang-sass";
  import { less } from "@codemirror/lang-less";

  import * as Select from "$lib/components/ui/select";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { Input } from "$lib/components/ui/input";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  enum CssFormatType {
    CSS = "css",
    SCSS = "scss",
    LESS = "less",
  }
  let selectedType = $state<CssFormatType>(CssFormatType.CSS);
  let value = $state(``);
  let formatedValue = $state(``);
  let tabWidth = $state(2);

  let highlightExtension = $derived.by(() => {
    switch (selectedType) {
      case CssFormatType.CSS:
        return css();
      case CssFormatType.SCSS:
        return sass();
      case CssFormatType.LESS:
        return less();
      default:
        return css();
    }
  });

  const handleFormat = async (e?: EditorView) => {
    try {
      const final = e ? e.state.doc.toString() : value;

      if (final.trim() === "") {
        formatedValue = "";
        return;
      }

      formatedValue = await prettier.format(value, {
        parser: selectedType,
        plugins: [cssPlugin],
        tabWidth,
      });
    } catch (error) {
      console.dir(error);

      let msg = "Error formating CSS";

      if (error instanceof SyntaxError) {
        msg = error.message;
        return;
      }

      toast.warning(msg, {
        position: "top-right",
        cancel: { label: "Close" },
        dismissable: true,
      });
    }
  };
</script>

<div class="flex gap-4 h-full">
  <AdvancedCard
    title={selectedType.toUpperCase() + " View"}
    opt2Value={value}
    onClear={() => (value = "")}
    class="flex-1"
  >
    {#snippet additionalButtons()}
      <div class="flex gap-4">
        <Input bind:value={tabWidth} type="number" class="w-20 h-7" />

        <Select.Root
          type="single"
          value={selectedType}
          onValueChange={(e) => (selectedType = e as CssFormatType)}
        >
          <Select.Trigger class="w-[130px] h-7">
            {selectedType}
          </Select.Trigger>

          <Select.Content>
            <Select.Group>
              <Select.GroupHeading>Convert To</Select.GroupHeading>
              {#each Object.values(CssFormatType) as e}
                <Select.Item value={e} label={e} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {/snippet}

    {#key selectedType}
      <AdvancedCodeMirror
        bind:value
        lineWrapping={true}
        theme={abcdef}
        basic={false}
        extensions={[
          placeholder("Enter css text here..."),
          minimalSetup,
          highlightExtension,
        ]}
        onReady={(e) => {
          if (!e.hasFocus) {
            e.focus();
          }
        }}
        class="h-full border shadow rounded-xl custom-editor"
        onChange={handleFormat}
      />
    {/key}
  </AdvancedCard>

  <AdvancedCard title="Formatted View" class="flex-1" opt2Value={formatedValue}>
    <AdvancedCodeMirror
      value={formatedValue}
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[minimalSetup, highlightExtension]}
      class="h-full border shadow rounded-xl custom-editor"
      readonly={true}
    />
  </AdvancedCard>
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 10px !important;
    padding: 4px !important;
    max-height: none;
  }
</style>
