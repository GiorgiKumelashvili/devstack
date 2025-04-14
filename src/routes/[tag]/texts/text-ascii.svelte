<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { open } from "@tauri-apps/plugin-dialog";
  import { listen } from "@tauri-apps/api/event";

  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import CopyIconButton from "$lib/components/advanced-ui/button/copy-icon-button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Button } from "$lib/components/ui/button";
  import { parseIpcPayload } from "$lib/utils";

  import type { IpcResponse } from "../../../types";
  import BrowserLink from "$lib/components/advanced-ui/link/browser-link.svelte";
  import { BaseDirectory, resolveResource } from "@tauri-apps/api/path";
  import { readDir } from "@tauri-apps/plugin-fs";

  type FigletDropdownItem = {
    path: string;
    label: string;
  };

  const availableFiglets: FigletDropdownItem[] = [
    { path: "", label: "Default" },
  ];

  let input = $state("");
  let value = $state<IpcResponse | null>(null);
  let currentFigletFont = $state<FigletDropdownItem>(availableFiglets[0]);

  const addFlfFont = async () => {
    const filePath = await open({
      multiple: true,
      title: "Select a filet file",
      filters: [{ name: "All Files", extensions: ["flf"] }],
    });

    if (!filePath?.length) {
      return;
    }

    const firstFiglet: FigletDropdownItem = {
      path: filePath[0],
      label: filePath[0].split("/").pop() ?? filePath[0],
    };
    const payload = {
      font: firstFiglet.path,
      text: input,
    };

    const figletExists = availableFiglets.find(
      (el) => el.path === firstFiglet.path,
    );
    const inputExists = input.trim() !== "";

    console.log("=".repeat(20));
    console.log(figletExists);
    console.dir(firstFiglet);

    if (figletExists) {
      if (!inputExists) return;

      await invoke("figlet_transform", payload);
      return;
    }

    for (const path of filePath) {
      const figletItem: FigletDropdownItem = {
        path,
        label: path.split("/").pop() ?? path,
      };

      const figletExists = availableFiglets.find((el) => el.path === path);
      if (figletExists) continue;

      availableFiglets.push(figletItem);
    }

    currentFigletFont = firstFiglet;

    if (inputExists) {
      await invoke("figlet_transform", payload);
    }
  };

  const onInput = (text: string) => {
    if (text.trim() === "") {
      input = "";
      value = null;
      return;
    }

    input = text;

    invoke("figlet_transform", {
      text: text,
      font:
        currentFigletFont.label === "Default"
          ? undefined
          : currentFigletFont.path,
    });
  };

  const onFigletDropdownChange = (path: string) => {
    let found = availableFiglets.find((el) => el.path === path);

    if (!found) {
      return;
    }

    currentFigletFont = found;

    if (input.trim() !== "") {
      invoke("figlet_transform", {
        text: input,
        font: currentFigletFont.label === "Default" ? undefined : path,
      });
    }
  };

  const unListen = listen<string>("figlet_transformed", (event) => {
    value = parseIpcPayload(event);
  });

  onMount(async () => {
    const path = "static/fonts/figlets";
    const figletFonts = await readDir(path, {
      baseDir: BaseDirectory.Resource,
    });

    const paths: FigletDropdownItem[] = (
      await Promise.all(
        figletFonts.map((e) => resolveResource(path + "/" + e.name)),
      )
    ).map((e) => ({
      path: e,
      label: e.split("/").pop() ?? e,
    }));

    availableFiglets.push(...paths);
  });

  onDestroy(() => {
    unListen.then((f) => f());
  });
</script>

<div class="flex flex-col gap-4 h-full w-full">
  <Card.Root>
    <Card.Header>
      <Card.Title>Figlet Text Input</Card.Title>
      <Card.Description>
        For more figlet go to this links
        <BrowserLink url="https://github.com/xero/figlet-fonts">
          figlet-fonts
        </BrowserLink>{","}
        <BrowserLink url="https://github.com/inteist/figlet-fonts-gallery">
          figlet-fonts-gallery
        </BrowserLink>
      </Card.Description>
    </Card.Header>

    <Card.Content class="flex-1 overflow-auto flex gap-3">
      <Input
        value={input}
        placeholder="Input text"
        oninput={(e) => onInput(e.currentTarget.value)}
        writingsuggestions={false}
        spellcheck={false}
      />

      <Select.Root
        type="single"
        value={currentFigletFont.path}
        onValueChange={onFigletDropdownChange}
      >
        <Select.Trigger class="w-[180px] overflow-hidden">
          {currentFigletFont.label}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.GroupHeading>Type</Select.GroupHeading>
            {#each availableFiglets as e}
              <Select.Item value={e.path} label={e.label} />
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>

      <Button onclick={addFlfFont}>Add font (*.flf)</Button>
    </Card.Content>
  </Card.Root>

  {#if value}
    <Card.Root class="flex flex-1 overflow-auto relative">
      <CopyIconButton
        class="absolute top-2 right-2"
        defaultDimenstions
        opt2Value={value?.data}
      />

      <Card.Content class="flex-1 overflow-x-auto">
        {#if value?.data}
          <!-- ! Very important don't add anything inside pre like space od indentation, will mess up figlets and must be exactly like this -->
          <pre class="font-mono">{value.data}</pre>
        {/if}

        {#if value?.error}
          <h1 class="text-3xl">{value.error.message}</h1>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 6px !important;
    padding: 3px !important;
    max-height: none;
  }
</style>
