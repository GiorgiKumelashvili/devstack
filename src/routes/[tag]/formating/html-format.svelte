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
  import { abcdef } from "@uiw/codemirror-themes-all";
  import { html } from "@codemirror/lang-html";

  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

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
  <AdvancedCard
    title="HTML View"
    opt2Value={value}
    onClear={() => (value = "")}
    class="flex-1"
  >
    <AdvancedCodeMirror
      bind:value
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[
        minimalSetup,
        html(),
        placeholder("Enter html text here..."),
      ]}
      class="h-full border shadow rounded-xl custom-editor"
      onReady={(e) => {
        if (!e.hasFocus) {
          e.focus();
        }
      }}
      onChange={handleFormat}
    />
  </AdvancedCard>

  <AdvancedCard title="Formatted View" class="flex-1" opt2Value={formatedValue}>
    <AdvancedCodeMirror
      value={formatedValue}
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[minimalSetup, html()]}
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
