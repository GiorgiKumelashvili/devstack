<script lang="ts">
  import jsyaml, { YAMLException } from "js-yaml";
  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { TriangleAlert } from "lucide-svelte";
  import { yaml } from "@codemirror/lang-yaml";
  import { EditorView, placeholder } from "@codemirror/view";
  import { andromeda as andromedaTheme } from "@uiw/codemirror-themes-all";

  import * as Alert from "$lib/components/ui/alert";
  import * as Card from "$lib/components/ui/card";
  import Input from "$lib/components/ui/input/input.svelte";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";

  let yamlValue = $state(``);
  let formatedYaml = $state(``);
  let settings = $state({
    forceQuotes: false,
    singleQuote: false,
    tabWidth: 2,
  });

  $effect(() => {
    settings;
    handleYamlFormat();
  });

  let errMessage = $state("");

  const handleYamlFormat = async (e?: EditorView) => {
    try {
      const value = e ? e.state.doc.toString() : yamlValue;

      if (value.trim() === "") {
        formatedYaml = "";
        return;
      }

      formatedYaml = jsyaml.dump(jsyaml.load(value), {
        indent: settings.tabWidth,
        forceQuotes: settings.forceQuotes,
        quotingType: settings.singleQuote ? "'" : '"',
      });
      errMessage = "";
    } catch (error) {
      console.dir(error);

      if (error instanceof SyntaxError || error instanceof YAMLException) {
        let msg = error.message;

        console.dir(error);
        errMessage = msg;
        return;
      }

      toast.warning("Error formating YAML", {
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
      <Card.Title>YAML View</Card.Title>

      <div class="flex">
        <CopyIconButton
          variant="outline"
          defaultDimenstions
          opt2Value={yamlValue}
        />
      </div>
    </Card.Header>

    <Card.Content class="flex-1 overflow-auto">
      <AdvancedCodeMirror
        bind:value={yamlValue}
        lineWrapping={true}
        theme={andromedaTheme}
        basic={false}
        extensions={[
          minimalSetup,
          placeholder("Enter yaml text here..."),
          yaml(),
        ]}
        class="h-full border-white custom-editor"
        onReady={(e) => {
          if (!e.hasFocus) {
            e.focus();
          }
        }}
        onChange={handleYamlFormat}
      />
    </Card.Content>
  </Card.Root>

  <div class="flex flex-1 flex-col gap-4">
    <Card.Root class="flex flex-1 basis-0 flex-col overflow-auto">
      <Card.Header class="flex-row items-center justify-between">
        <Card.Title>Formatted View</Card.Title>

        <div class="flex gap-5">
          <Input bind:value={settings.tabWidth} type="number" class="w-20" />

          <div class="flex items-center space-x-2">
            <Switch bind:checked={settings.forceQuotes} id="with-tabs" />
            <Label for="with-tabs">Force Quotes</Label>
          </div>

          <div class="flex items-center space-x-2">
            <Switch bind:checked={settings.singleQuote} id="with-tabs" />
            <Label for="with-tabs">Single Quotes</Label>
          </div>

          <CopyIconButton
            variant="outline"
            defaultDimenstions
            opt2Value={formatedYaml}
          />
        </div>
      </Card.Header>

      <Card.Content class="flex-1 overflow-auto relative">
        <AdvancedCodeMirror
          value={formatedYaml}
          lineWrapping={true}
          theme={andromedaTheme}
          basic={false}
          extensions={[minimalSetup, yaml()]}
          class="h-full border-white custom-editor"
          readonly={true}
        />

        {#if errMessage}
          <Alert.Root
            variant="destructive"
            class="absolute z-10 bottom-8 left-8 right-8 w-auto dark:bg-red-200 max-h-96 overflow-auto"
          >
            <TriangleAlert class="h-4 w-4" />

            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              {errMessage}
            </Alert.Description>
          </Alert.Root>
        {/if}
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
