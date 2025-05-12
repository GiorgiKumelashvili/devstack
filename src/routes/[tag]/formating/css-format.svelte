<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as cssPlugin from "prettier/plugins/postcss.js";

  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { EditorView, placeholder } from "@codemirror/view";
  import { andromeda as andromedaTheme } from "@uiw/codemirror-themes-all";
  import { css } from "@codemirror/lang-css";
  import { sass } from "@codemirror/lang-sass";
  import { less } from "@codemirror/lang-less";

  import * as Select from "$lib/components/ui/select";
  import * as Card from "$lib/components/ui/card";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { Input } from "$lib/components/ui/input";

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
  <Card.Root class="flex-1 flex flex-col">
    <Card.Header class="flex-row items-center justify-between">
      <Card.Title>{selectedType.toUpperCase()} View</Card.Title>

      <div class="flex gap-4">
        <Input bind:value={tabWidth} type="number" class="w-20" />

        <Select.Root
          type="single"
          value={selectedType}
          onValueChange={(e) => (selectedType = e as CssFormatType)}
        >
          <Select.Trigger class="w-[130px]">
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

        <CopyIconButton
          variant="outline"
          defaultDimenstions
          opt2Value={value}
        />
      </div>
    </Card.Header>

    <Card.Content class="flex-1 overflow-auto">
      {#key selectedType}
        <AdvancedCodeMirror
          bind:value
          lineWrapping={true}
          theme={andromedaTheme}
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
          class="h-full border-white custom-editor"
          onChange={handleFormat}
        />
      {/key}
    </Card.Content>
  </Card.Root>

  <div class="flex flex-1 flex-col gap-4">
    <Card.Root class="flex flex-1 basis-0 flex-col overflow-auto">
      <Card.Header class="flex-row items-center justify-between">
        <Card.Title>Formatted View</Card.Title>

        <div class="flex gap-5">
          <CopyIconButton
            variant="outline"
            defaultDimenstions
            opt2Value={formatedValue}
          />
        </div>
      </Card.Header>

      <Card.Content class="flex-1 overflow-auto relative">
        <AdvancedCodeMirror
          value={formatedValue}
          lineWrapping={true}
          theme={andromedaTheme}
          basic={false}
          extensions={[minimalSetup, highlightExtension]}
          class="h-full border-white custom-editor"
          readonly={true}
        />
      </Card.Content>
    </Card.Root>
  </div>
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 6px !important;
    padding: 3px !important;
    max-height: none;
  }
</style>
