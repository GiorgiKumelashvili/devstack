<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { basicSetup } from "codemirror";
  import {
    EditorView,
    keymap,
    placeholder as placeholderExt,
  } from "@codemirror/view";
  import { EditorState, StateEffect } from "@codemirror/state";
  import { indentWithTab } from "@codemirror/commands";
  import { indentUnit } from "@codemirror/language";
  import type { Extension, Text } from "@codemirror/state";

  type CodeMirrorTheme = Parameters<typeof EditorView.theme>[0];

  type Props = {
    class?: string;
    value?: string;
    basic?: boolean;
    lang?: Extension;
    theme?: Extension;
    extensions?: Extension[];
    useTab?: boolean;
    tabSize?: number;
    styles?: CodeMirrorTheme;
    lineWrapping?: boolean;
    editable?: boolean;
    readonly?: boolean;
    placeholder?: string;
    onReady?: (view: EditorView) => void;
    onReconfigure?: (view: EditorView) => void;
    onChange?: (value: EditorView) => void;
  };

  let {
    class: classes = "",
    value = $bindable(""),
    basic = true,
    lang = undefined,
    theme = undefined,
    extensions = [],
    useTab = true,
    tabSize = 2,
    styles = undefined,
    lineWrapping = false,
    editable = true,
    readonly = false,
    placeholder = undefined,
    onReady = () => {},
    onReconfigure = () => {},
    onChange = () => {},
  }: Props = $props();

  const is_browser = typeof window !== "undefined";
  let element = $state<HTMLDivElement>();
  let view: EditorView;
  let update_from_prop = false;
  let update_from_state = false;
  let first_config = true;
  let first_update = true;

  const state_extensions = $derived((): Extension[] => {
    return [
      ...get_base_extensions(
        basic,
        useTab,
        tabSize,
        lineWrapping,
        placeholder,
        editable,
        readonly,
        lang,
      ),
      ...get_theme(theme, styles),
      ...extensions,
    ];
  });

  $effect(() => {
    view;

    update(value);
  });

  $effect(() => {
    view;
    state_extensions;

    reconfigure();
  });

  const on_change = $derived(handle_change);

  onMount(() => {
    view = create_editor_view();
    onReady(view);
  });

  onDestroy(() => view?.destroy());

  function create_editor_view() {
    return new EditorView({
      parent: element,
      state: create_editor_state(value),
      dispatch(transaction) {
        view.update([transaction]);
        if (!update_from_prop && transaction.docChanged) {
          on_change();
        }
      },
    });
  }

  function reconfigure() {
    if (first_config) {
      first_config = false;
      return;
    }

    view.dispatch({
      effects: StateEffect.reconfigure.of(state_extensions()),
    });

    onReconfigure(view);
  }

  function update(value2: string | Text) {
    if (first_update) {
      first_update = false;
      return;
    }
    if (update_from_state) {
      update_from_state = false;
      return;
    }
    update_from_prop = true;
    view.setState(create_editor_state(value2));
    update_from_prop = false;
  }

  function handle_change() {
    const new_value = view.state.doc.toString();
    if (new_value === value) return;
    update_from_state = true;
    value = new_value;

    onChange(view);
  }

  function create_editor_state(value2: string | Text) {
    return EditorState.create({
      doc: value2 ?? void 0,
      extensions: state_extensions(),
    });
  }

  function get_base_extensions(
    basic: boolean,
    useTab: boolean,
    tabSize: number,
    lineWrapping: boolean,
    placeholder: string | undefined,
    editable: boolean,
    readonly: boolean,
    lang: Extension | undefined,
  ) {
    const extensions2 = [
      indentUnit.of(" ".repeat(tabSize)),
      EditorView.editable.of(editable),
      EditorState.readOnly.of(readonly),
    ];
    if (basic) extensions2.push(basicSetup);
    if (useTab) extensions2.push(keymap.of([indentWithTab]));
    if (placeholder) extensions2.push(placeholderExt(placeholder));
    if (lang) extensions2.push(lang);
    if (lineWrapping) extensions2.push(EditorView.lineWrapping);
    return extensions2;
  }

  function get_theme(
    theme2: Extension | undefined,
    styles2: CodeMirrorTheme | undefined,
  ) {
    const extensions2 = [];
    if (styles2) extensions2.push(EditorView.theme(styles2));
    if (theme2) extensions2.push(theme2);
    return extensions2;
  }
</script>

{#if is_browser}
  <div class="codemirror-wrapper {classes}" bind:this={element}></div>
{:else}
  <div class="scm-waiting {classes}">
    <div class="scm-waiting__loading scm-loading">
      <div class="scm-loading__spinner"></div>
      <p class="scm-loading__text">Loading editor...</p>
    </div>

    <pre class="scm-pre cm-editor">{value}</pre>
  </div>
{/if}

<style>
  .codemirror-wrapper :global(.cm-focused) {
    outline: none;
  }

  .scm-waiting {
    position: relative;
  }
  .scm-waiting__loading {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .scm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scm-loading__spinner {
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    border: solid 2px #000;
    border-top-color: transparent;
    margin-right: 0.75rem;
    animation: spin 1s linear infinite;
  }
  .scm-loading__text {
    font-family: sans-serif;
  }
  .scm-pre {
    font-size: 0.85rem;
    font-family: monospace;
    tab-size: 2;
    -moz-tab-size: 2;
    resize: none;
    pointer-events: none;
    user-select: none;
    overflow: auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
