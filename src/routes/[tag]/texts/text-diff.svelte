<script lang="ts">
  import { FoldVertical, GitMerge } from "lucide-svelte";
  import { abcdef } from "@uiw/codemirror-themes-all";
  import { minimalSetup } from "codemirror";
  import { placeholder } from "@codemirror/view";
  import { unifiedMergeView } from "@codemirror/merge";

  import { Toggle } from "$lib/components/ui/toggle";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  let originalValue = $state("");
  let modifiedValue = $state("");

  let toggleMergeControlls = $state(false);
  let toggleUnchangedItem = $state(false);
</script>

<div class="flex gap-4 h-full">
  <div class="flex flex-1 flex-col gap-4">
    <AdvancedCard
      title="Original Text Input"
      opt2Value={originalValue}
      onClear={() => (originalValue = "")}
      class="flex flex-1 basis-0 flex-col overflow-auto"
    >
      <AdvancedCodeMirror
        bind:value={originalValue}
        lineWrapping={true}
        theme={abcdef}
        basic={false}
        extensions={[minimalSetup, placeholder("Enter original text here...")]}
        class="h-full border shadow rounded-xl custom-editor"
        onReady={(e) => {
          if (!e.hasFocus) {
            e.focus();
          }
        }}
      />
    </AdvancedCard>

    <AdvancedCard
      title="Modified Text Input"
      opt2Value={modifiedValue}
      onClear={() => (modifiedValue = "")}
      class="flex flex-1 basis-0 flex-col overflow-auto"
    >
      <AdvancedCodeMirror
        bind:value={modifiedValue}
        lineWrapping={true}
        theme={abcdef}
        basic={false}
        extensions={[minimalSetup, placeholder("Enter modified text here...")]}
        class="h-full border shadow rounded-xl custom-editor"
      />
    </AdvancedCard>
  </div>

  <AdvancedCard
    title="Modified Text Input"
    class="flex flex-1 basis-0 flex-col overflow-auto"
  >
    {#snippet additionalButtons()}
      <Toggle
        variant="outline"
        size="sm"
        class="h-7 w-7 active:scale-75 transition-all"
        aria-label="Toggle merge controls"
        title="Toggle merge controls"
        onclick={() => (toggleMergeControlls = !toggleMergeControlls)}
      >
        <GitMerge scale={0.8} />
      </Toggle>

      <Toggle
        variant="outline"
        size="sm"
        class="h-7 w-7 active:scale-75 transition-all"
        aria-label="Collapse unchanged item"
        title="Collapse unchanged item"
        onclick={() => (toggleUnchangedItem = !toggleUnchangedItem)}
      >
        <FoldVertical scale={0.8} />
      </Toggle>
    {/snippet}

    <AdvancedCodeMirror
      bind:value={modifiedValue}
      theme={abcdef}
      lineWrapping={true}
      basic={false}
      readonly={true}
      extensions={[
        placeholder("Unified merge view will appear here..."),
        minimalSetup,
        unifiedMergeView({
          original: originalValue,
          mergeControls: toggleMergeControlls,
          collapseUnchanged: toggleUnchangedItem
            ? { margin: 10, minSize: 10 }
            : undefined,
        }),
      ]}
      class="h-full border shadow rounded-xl custom-editor custom-unified-editor"
    />
  </AdvancedCard>
</div>

<style>
  :global .custom-editor .cm-editor {
    border-radius: 10px !important;
    padding: 4px !important;
    height: 100%;
    max-height: none;
  }

  :global .custom-unified-editor .cm-gutters {
    background-color: transparent;
  }
</style>
