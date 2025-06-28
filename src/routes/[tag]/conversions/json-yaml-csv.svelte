<script lang="ts">
  import Papa from "papaparse";
  import {
    abcdef,
    andromeda as andromedaTheme,
  } from "@uiw/codemirror-themes-all";
  import jsyaml, { YAMLException } from "js-yaml";
  import { toast } from "svelte-sonner";
  import { minimalSetup } from "codemirror";
  import { json } from "@codemirror/lang-json";
  import { yaml } from "@codemirror/lang-yaml";
  import { EditorView, placeholder } from "@codemirror/view";

  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { AdvancedCard } from "$lib/components/advanced-ui/card";

  enum ConvertorType {
    YAML = "YAML",
    CSV = "CSV",
  }

  let selectedType = $state<ConvertorType>(ConvertorType.YAML);
  let jsonValue = $state(``);
  let yamlValue = $state(``);
  let csvValue = $state(``);

  const handleJsonEditorChange = (e: EditorView) => {
    const json = e.state.doc.toString();

    if (json.trim() === "") {
      yamlValue = "";
      csvValue = "";
      return;
    }

    if (selectedType === ConvertorType.YAML) {
      const yaml = jsonToYaml(json);

      if (yaml) {
        yamlValue = yaml;
      }
    }

    if (selectedType === ConvertorType.CSV) {
      const csv = jsonToCsv(json);

      console.log("=".repeat(20));
      console.log(csv);

      if (csv) {
        csvValue = csv;
      }
    }
  };

  const handleYamlEditorChange = (e: EditorView) => {
    const yaml = e.state.doc.toString();

    if (yaml.trim() === "") {
      jsonValue = "";
      return;
    }

    const json = yamlToJson(yaml);

    if (json) {
      jsonValue = json;
    }
  };

  const handleCsvEditorChange = (
    e: Event & { currentTarget: EventTarget & HTMLTextAreaElement },
  ) => {
    const csv = e.currentTarget.value || "";

    if (csv.trim() === "") {
      jsonValue = "";
      return;
    }

    const json = csvToJson(csv);

    if (json) {
      jsonValue = json;
    }
  };

  const jsonToYaml = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      return jsyaml.dump(data);
    } catch (e) {
      let msg = "Error converting JSON to YAML";

      if (e instanceof SyntaxError) {
        msg = "Invalid JSON";
      }

      if (e instanceof YAMLException) {
        msg = e.reason;
      }

      toast.warning(msg, {
        position: "top-right",
        cancel: { label: "Close" },
        dismissable: true,
      });
      console.dir(e);
    }
  };

  const yamlToJson = (yamlString: string) => {
    try {
      const data = jsyaml.load(yamlString);
      return JSON.stringify(data, null, 2); // Pretty print JSON
    } catch (e) {
      let msg = "Error converting YAML to JSON";

      if (e instanceof SyntaxError) {
        msg = "Invalid JSON";
      }

      if (e instanceof YAMLException) {
        msg = `${e.name}: ${e.reason}`;
      }

      toast.warning(msg, {
        position: "top-right",
        cancel: { label: "Close" },
        dismissable: true,
      });
      console.dir(e);
    }
  };

  const jsonToCsv = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);

      if (!Array.isArray(data)) {
        toast.warning("JSON input for CSV conversion must be an array", {
          position: "top-right",
          cancel: { label: "Close" },
          dismissable: true,
        });
        return;
      }

      return Papa.unparse(data);
    } catch (e) {
      let msg = "Error converting JSON to CSV";

      if (e instanceof SyntaxError) {
        msg = "Invalid JSON";
      }

      toast.warning(msg, {
        position: "top-right",
        cancel: { label: "Close" },
        dismissable: true,
      });
      console.dir(e);
    }
  };

  const csvToJson = (csvString: string) => {
    try {
      const result = Papa.parse(csvString, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true, // Skip empty lines
      });

      if (result.errors.length > 0) {
        toast.warning("CSV Parsing Errors", {
          position: "top-right",
          cancel: { label: "Close" },
          dismissable: true,
        });
        return;
      }

      return JSON.stringify(result.data, null, 2); // Pretty print JSON
    } catch (e) {
      let msg = "Error converting CSV to JSON";

      if (e instanceof SyntaxError) {
        msg = "Invalid CSV";
      }

      toast.warning(msg, {
        position: "top-right",
        cancel: { label: "Close" },
        dismissable: true,
      });
      console.dir(e);
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
      onChange={handleJsonEditorChange}
    />
  </AdvancedCard>

  <AdvancedCard
    title={selectedType + " View"}
    class="flex-1"
    opt2Value={selectedType === ConvertorType.YAML ? yamlValue : csvValue}
  >
    {#snippet additionalButtons()}
      <div class="flex gap-3">
        <Select.Root
          type="single"
          value={selectedType}
          onValueChange={(e) => (selectedType = e as ConvertorType)}
        >
          <Select.Trigger class="w-[90px] h-7">
            {selectedType}
          </Select.Trigger>

          <Select.Content>
            <Select.Group>
              <Select.GroupHeading>Convert To</Select.GroupHeading>
              {#each Object.values(ConvertorType) as e}
                <Select.Item value={e} label={e} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {/snippet}

    {#if selectedType === ConvertorType.YAML}
      <AdvancedCodeMirror
        bind:value={yamlValue}
        lineWrapping={true}
        theme={abcdef}
        basic={false}
        extensions={[
          minimalSetup,
          placeholder(`Enter yaml text here...`),
          yaml(),
        ]}
        class="h-full border shadow rounded-xl custom-editor"
        onChange={handleYamlEditorChange}
      />
    {:else}
      <textarea
        class="w-full h-full rounded-md outline-none p-2 resize-none bg-secondary font-mono text-[#D5CED9] text-area-font"
        placeholder="Enter csv text here..."
        oninput={handleCsvEditorChange}
        bind:value={csvValue}
      ></textarea>
    {/if}
  </AdvancedCard>
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 10px !important;
    padding: 4px !important;
    max-height: none;
  }

  .text-area-font {
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: 400;

    &::placeholder {
      color: #888888;
    }
  }
</style>
