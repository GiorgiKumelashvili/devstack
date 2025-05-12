<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as sqlPlugin from "prettier-plugin-sql";

  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { EditorView, placeholder } from "@codemirror/view";
  import { andromeda as andromedaTheme } from "@uiw/codemirror-themes-all";
  import { sql } from "@codemirror/lang-sql";

  import * as Card from "$lib/components/ui/card";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { Input } from "$lib/components/ui/input";

  let value = $state(``);
  let formatedValue = $state(``);
  let tabWidth = $state(2);

  const handleFormat = async (e?: EditorView) => {
    try {
      const final = e ? e.state.doc.toString() : value;

      if (final.trim() === "") {
        formatedValue = "";
        return;
      }

      formatedValue = await prettier.format(value, {
        parser: "sql",
        plugins: [sqlPlugin.default],
        tabWidth,
      });
    } catch (error) {
      console.dir(error);

      let msg = "Error formating SQL";

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
      <Card.Title>SQL View</Card.Title>

      <div class="flex gap-4">
        <Input bind:value={tabWidth} type="number" class="w-20" />

        <CopyIconButton
          variant="outline"
          defaultDimenstions
          opt2Value={value}
        />
      </div>
    </Card.Header>

    <Card.Content class="flex-1 overflow-auto">
      <AdvancedCodeMirror
        bind:value
        lineWrapping={true}
        theme={andromedaTheme}
        basic={false}
        extensions={[
          placeholder("Enter sql text here..."),
          minimalSetup,
          sql(),
        ]}
        onReady={(e) => {
          if (!e.hasFocus) {
            e.focus();
          }
        }}
        class="h-full border-white custom-editor"
        onChange={handleFormat}
      />
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
          extensions={[minimalSetup, sql()]}
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
