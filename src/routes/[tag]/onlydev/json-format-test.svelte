<script lang="ts">
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { darcula } from "@uiw/codemirror-themes-all";
  import { json } from "@codemirror/lang-json";
  import { minimalSetup } from "codemirror";

  import Button from "$lib/components/ui/button/button.svelte";
  import CardContent from "$lib/components/ui/card/card-content.svelte";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";
  import { Card } from "$lib/components/ui/card";

  let someJson = $state(`{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}`);

  let withTabs = $state(false);

  const format = () => {
    someJson = JSON.stringify(JSON.parse(someJson), null, withTabs ? "\t" : 2);
  };
</script>

<br />

<div>
  <AdvancedCodeMirror
    class="w-full"
    bind:value={someJson}
    lineWrapping={true}
    theme={darcula}
    extensions={[json(), minimalSetup]}
  />
</div>

<div>
  {someJson}
</div>

<Card>
  <CardContent class="flex flex-col gap-4">
    <Button class="self-start" onclick={format}>Format</Button>

    <div class="flex items-center space-x-2">
      <Switch bind:checked={withTabs} id="with-tabs" />
      <Label for="with-tabs">With tabs</Label>
    </div>
  </CardContent>
</Card>
