<script lang="ts">
  import * as themes from "@uiw/codemirror-themes-all";
  import CodeMirror from "svelte-codemirror-editor";
  import { minimalSetup } from "codemirror";
  import { placeholder } from "@codemirror/view";
  import { FoldVertical, GitMerge, X } from "lucide-svelte";

  import * as Card from "$lib/components/ui/card/index.js";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import { Button } from "$lib/components/ui/button";

  import { unifiedMergeView } from "@codemirror/merge";
  import { Toggle } from "$lib/components/ui/toggle";

  let originalValue = $state("");
  let modifiedValue = $state("");

  let toggleMergeControlls = $state(false);
  let toggleUnchangedItem = $state(false);
</script>

<div class="flex gap-4 h-full">
  <div class="flex flex-1 flex-col gap-4">
    <Card.Root class="flex flex-1 basis-0 flex-col overflow-auto">
      <Card.Header class="flex-row items-center justify-between">
        <Card.Title>Original Text Input</Card.Title>

        <div class="fle">
          <CopyIconButton
            variant="outline"
            defaultDimenstions
            opt2Value={originalValue}
          />

          <Button
            variant="outline"
            size="icon"
            onclick={() => (originalValue = "")}
          >
            <X />
          </Button>
        </div>
      </Card.Header>

      <Card.Content class="flex-1 overflow-auto">
        <CodeMirror
          bind:value={originalValue}
          nodebounce={true}
          lineWrapping={true}
          theme={themes.monokaiDimmed}
          basic={false}
          extensions={[
            minimalSetup,
            placeholder("Enter original text here..."),
          ]}
          class="h-full border-white custom-editor"
          on:ready={(e) => {
            if (!e.detail.hasFocus) {
              e.detail.focus();
            }
          }}
        />
      </Card.Content>
    </Card.Root>

    <Card.Root class="flex flex-1 basis-0 flex-col overflow-auto">
      <Card.Header class="flex-row items-center justify-between">
        <Card.Title>Modified Text Input</Card.Title>

        <div class="fle">
          <CopyIconButton
            variant="outline"
            defaultDimenstions
            opt2Value={modifiedValue}
          />

          <Button
            variant="outline"
            size="icon"
            onclick={() => (modifiedValue = "")}
          >
            <X />
          </Button>
        </div>
      </Card.Header>

      <Card.Content class="flex-1 overflow-auto">
        <CodeMirror
          bind:value={modifiedValue}
          nodebounce={true}
          lineWrapping={true}
          theme={themes.monokaiDimmed}
          basic={false}
          extensions={[
            minimalSetup,
            placeholder("Enter modified text here..."),
          ]}
          class="h-full border-white custom-editor"
        />
      </Card.Content>
    </Card.Root>
  </div>

  <Card.Root class="flex-1 flex flex-col">
    <Card.Header class="flex-row items-center justify-between">
      <Card.Title>Diff View</Card.Title>

      <div class="fle">
        <Toggle
          variant="outline"
          size="sm"
          class="h-9 w-9 active:scale-75 transition-all"
          aria-label="Toggle merge controls"
          title="Toggle merge controls"
          onclick={() => (toggleMergeControlls = !toggleMergeControlls)}
        >
          <GitMerge />
        </Toggle>

        <Toggle
          variant="outline"
          size="sm"
          class="h-9 w-9 active:scale-75 transition-all"
          aria-label="Collapse unchanged item"
          title="Collapse unchanged item"
          onclick={() => (toggleUnchangedItem = !toggleUnchangedItem)}
        >
          <FoldVertical />
        </Toggle>
      </div>
    </Card.Header>

    <Card.Content class="flex-1 overflow-auto">
      <CodeMirror
        bind:value={modifiedValue}
        theme={themes.monokaiDimmed}
        lineWrapping={true}
        basic={false}
        readonly={true}
        extensions={[
          minimalSetup,
          unifiedMergeView({
            original: originalValue,
            mergeControls: toggleMergeControlls,
            collapseUnchanged: toggleUnchangedItem
              ? { margin: 10, minSize: 10 }
              : undefined,
          }),
        ]}
        class="h-full border-white custom-editor"
      />
    </Card.Content>
  </Card.Root>
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 6px !important;
    padding: 3px !important;
    max-height: none;
  }
</style>
