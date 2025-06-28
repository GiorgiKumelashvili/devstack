<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as sqlPlugin from "prettier-plugin-sql";

  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { EditorView, placeholder } from "@codemirror/view";
  import {
    abcdef,
    andromeda as andromedaTheme,
  } from "@uiw/codemirror-themes-all";
  import { sql } from "@codemirror/lang-sql";

  import * as Card from "$lib/components/ui/card";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { Input } from "$lib/components/ui/input";
  import { AdvancedCard } from "$lib/components/advanced-ui/card";

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
  <AdvancedCard
    title="SQL View"
    opt2Value={value}
    onClear={() => (value = "")}
    class="flex-1"
  >
    {#snippet additionalButtons()}
      <Input bind:value={tabWidth} type="number" class="w-20 h-7" />
    {/snippet}

    <AdvancedCodeMirror
      bind:value
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[placeholder("Enter sql text here..."), minimalSetup, sql()]}
      onReady={(e) => {
        if (!e.hasFocus) {
          e.focus();
        }
      }}
      class="h-full border shadow rounded-xl custom-editor"
      onChange={handleFormat}
    />
  </AdvancedCard>

  <AdvancedCard title="Formatted View" class="flex-1" opt2Value={formatedValue}>
    <AdvancedCodeMirror
      value={formatedValue}
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[minimalSetup, sql()]}
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
