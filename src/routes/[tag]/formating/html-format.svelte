<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as htmlPlugin from "prettier/plugins/html.js";
  import * as cssPlugin from "prettier/plugins/postcss.js";
  import * as babelPlugin from "prettier/plugins/babel.js";
  import * as esTreePlugin from "prettier/plugins/estree.js";

  import { type Plugin } from "prettier";
  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { EditorView, placeholder } from "@codemirror/view";
  import { andromeda as andromedaTheme } from "@uiw/codemirror-themes-all";
  import { html } from "@codemirror/lang-html";

  import * as Card from "$lib/components/ui/card";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";

  let value = $state(``);
  let formatedValue = $state(``);

  const handleFormat = async (e?: EditorView) => {
    try {
      const final = e ? e.state.doc.toString() : value;

      if (final.trim() === "") {
        formatedValue = "";
        return;
      }

      formatedValue = await prettier.format(value, {
        parser: "html",
        plugins: [
          htmlPlugin,
          cssPlugin,
          babelPlugin,
          babelPlugin,
          esTreePlugin as Plugin,
        ],
      });
    } catch (error) {
      console.dir(error);

      let msg = "Error formating HTML";

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
      <Card.Title>HTML View</Card.Title>

      <div class="flex">
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
          minimalSetup,
          html(),
          placeholder("Enter html text here..."),
        ]}
        class="h-full border-white custom-editor"
        onReady={(e) => {
          if (!e.hasFocus) {
            e.focus();
          }
        }}
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
          extensions={[minimalSetup, html()]}
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
