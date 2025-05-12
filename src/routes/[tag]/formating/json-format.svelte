<script lang="ts">
  import * as prettier from "prettier/standalone";
  import * as babelPlugin from "prettier/plugins/babel.js";
  import * as esTreePlugin from "prettier/plugins/estree";
  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { json } from "@codemirror/lang-json";
  import { EditorView, placeholder } from "@codemirror/view";
  import { andromeda as andromedaTheme } from "@uiw/codemirror-themes-all";

  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { type Plugin } from "prettier";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";

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
  <Card.Root class="flex-1 flex flex-col">
    <Card.Header class="flex-row items-center justify-between">
      <Card.Title>JSON View</Card.Title>

      <div class="flex gap-5">
        <Select.Root
          type="single"
          value={selectedType}
          onValueChange={(e) => (selectedType = e as JsonFormatType)}
        >
          <Select.Trigger class="w-[130px]">
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

        <CopyIconButton
          variant="outline"
          defaultDimenstions
          opt2Value={jsonValue}
        />
      </div>
    </Card.Header>

    <Card.Content class="flex-1 overflow-auto">
      <AdvancedCodeMirror
        bind:value={jsonValue}
        lineWrapping={true}
        theme={andromedaTheme}
        basic={false}
        extensions={[
          minimalSetup,
          placeholder("Enter json text here..."),
          json(),
        ]}
        class="h-full border-white custom-editor"
        onReady={(e) => {
          if (!e.hasFocus) {
            e.focus();
          }
        }}
        onChange={handleJsonFormat}
      />
    </Card.Content>
  </Card.Root>

  <div class="flex flex-1 flex-col gap-4">
    <Card.Root class="flex flex-1 basis-0 flex-col overflow-auto">
      <Card.Header class="flex-row items-center justify-between">
        <Card.Title>Formatted View</Card.Title>

        <div class="flex gap-5">
          <Input
            bind:value={tabWidth}
            type="number"
            class="w-20"
            disabled={useTabs}
          />

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

          <CopyIconButton
            variant="outline"
            defaultDimenstions
            opt2Value={formatedJson}
          />
        </div>
      </Card.Header>

      <Card.Content class="flex-1 overflow-auto">
        <AdvancedCodeMirror
          value={formatedJson}
          lineWrapping={true}
          theme={andromedaTheme}
          basic={false}
          extensions={[minimalSetup, json()]}
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
