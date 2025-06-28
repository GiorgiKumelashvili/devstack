<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as babelPlugin from "prettier/plugins/babel.js";
  import * as esTreePlugin from "prettier/plugins/estree";
  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { json } from "@codemirror/lang-json";
  import { EditorView, placeholder } from "@codemirror/view";
  import { abcdef } from "@uiw/codemirror-themes-all";
  import { type Plugin } from "prettier";

  import * as Select from "$lib/components/ui/select";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  enum JsonFormatType {
    JSON = "json",
    JSONC = "jsonc",
    JSON5 = "json5",
    JSON_STRINGIFY = "json-stringify",
  }

  let selectedType = $state<JsonFormatType>(JsonFormatType.JSON);
  let jsonValue = $state(``);
  let formatedJson = $state(``);
  let useTabs = $state(false);
  let tabWidth = $state(2);
  let singleQuote = $state(false);

  $effect(() => {
    useTabs;
    singleQuote;
    tabWidth;
    selectedType;

    handleJsonFormat();
  });

  const handleJsonFormat = async (e?: EditorView) => {
    try {
      const json = e ? e.state.doc.toString() : jsonValue;

      if (json.trim() === "") {
        formatedJson = "";
        return;
      }

      formatedJson = await prettier.format(json, {
        parser: selectedType,
        plugins: [babelPlugin, esTreePlugin as Plugin],
        tabWidth,
        singleQuote,
        useTabs,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        let msg = "Error formating JSON";

        if (error instanceof SyntaxError) {
          msg = error.message;
        }

        toast.warning(msg, {
          position: "top-right",
          cancel: { label: "Close" },
          dismissable: true,
        });
        console.dir(error);
      }
    }
  };
</script>

<div class="flex gap-4 h-full">
  <AdvancedCard
    title="JSON View"
    class="flex-1"
    opt2Value={jsonValue}
    onClear={() => (jsonValue = "")}
  >
    {#snippet additionalButtons()}
      <div class="flex gap-3">
        <Select.Root
          type="single"
          value={selectedType}
          onValueChange={(e) => (selectedType = e as JsonFormatType)}
        >
          <Select.Trigger class="w-[130px] h-7">
            {selectedType}
          </Select.Trigger>

          <Select.Content>
            <Select.Group>
              <Select.GroupHeading>Convert To</Select.GroupHeading>
              {#each Object.values(JsonFormatType) as e}
                <Select.Item value={e} label={e} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {/snippet}

    <AdvancedCodeMirror
      bind:value={jsonValue}
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[
        minimalSetup,
        placeholder("Enter json text here..."),
        json(),
      ]}
      class="h-full border shadow rounded-xl custom-editor"
      onReady={(e) => {
        if (!e.hasFocus) {
          e.focus();
        }
      }}
      onChange={handleJsonFormat}
    />
  </AdvancedCard>

  <AdvancedCard title="Formatted View" class="flex-1" opt2Value={formatedJson}>
    {#snippet additionalButtons()}
      <div class="flex gap-3">
        {#if selectedType === JsonFormatType.JSON5}
          <div class="flex items-center space-x-2">
            <Switch bind:checked={singleQuote} id="with-tabs" />
            <Label for="with-tabs">Single Quotes</Label>
          </div>
        {/if}

        <div class="flex items-center space-x-2">
          <Switch bind:checked={useTabs} id="with-tabs" />
          <Label for="with-tabs">Use Tabs</Label>
        </div>

        <Input
          bind:value={tabWidth}
          type="number"
          class="w-20 h-7"
          disabled={useTabs}
        />
      </div>
    {/snippet}

    <AdvancedCodeMirror
      value={formatedJson}
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[minimalSetup, json()]}
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
