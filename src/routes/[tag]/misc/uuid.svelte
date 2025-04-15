<script lang="ts">
  import { v1, v3, v4, v5, v6, v7, validate, version, MAX, NIL } from "uuid";
  import { CircleHelp, RefreshCw } from "lucide-svelte";

  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import InformationInput from "$lib/components/advanced-ui/information-input.svelte";

  let input = $state("");
  let errorMessage = $state("");
  let inputVersion = $state("");
  $effect(() => {
    if (input.trim() === "") {
      inputVersion = "";
      errorMessage = "";
      return;
    }

    if (!validate(input)) {
      inputVersion = "";
      errorMessage = "Invalid UUID";
      return;
    }

    inputVersion = version(input).toString();
    errorMessage = "";
  });

  let forV3 = $state({
    namespace: v4(),
    name: "Example Name For V3",
    get value() {
      try {
        return v3(this.name, this.namespace);
      } catch (error) {
        return "";
      }
    },
  });
  let forV5 = $state({
    namespace: v4(),
    name: "Example Name For V5",
    get value() {
      try {
        return v5(this.name, this.namespace);
      } catch (error) {
        return "";
      }
    },
  });
  let randomUUIDs = $state({
    v1: v1(),
    v4: v4(),
    v6: v6(),
    v7: v7(),
  });
  const regenerate = () => {
    randomUUIDs = {
      v1: v1(),
      v4: v4(),
      v6: v6(),
      v7: v7(),
    };
    forV3.namespace = v4();
    forV5.namespace = v4();
  };

  type AvailableVersion = {
    label: string;
    value: number;
    method: () => string;
  };
  let amountOfUUIDs = $state<number>(1);
  let selectedVersion = $state<number>(4);
  let availableVersions: AvailableVersion[] = [
    {
      label: "v1",
      value: 1,
      method: () => v1(),
    },
    {
      label: "v3",
      value: 3,
      method: () => v3(forV3.name, v4()),
    },
    {
      label: "v4",
      value: 4,
      method: () => v4(),
    },
    {
      label: "v5",
      value: 5,
      method: () => v5(forV5.name, v4()),
    },
    {
      label: "v6",
      value: 6,
      method: () => v6(),
    },
    {
      label: "v7",
      value: 7,
      method: () => v7(),
    },
  ];
  let generatedUUIDs = $state<string[]>([]);
  const onVersionChange = (versionNumber: string) => {
    let found = availableVersions.find(
      (el) => el.value.toString() === versionNumber,
    );

    if (!found) {
      selectedVersion = 4;
      return;
    }

    selectedVersion = found.value;
  };
  const generateMultiple = () => {
    const found = availableVersions.find((el) => el.value === selectedVersion);

    if (!found) {
      return;
    }

    generatedUUIDs = Array.from({ length: amountOfUUIDs }, () =>
      found.method(),
    );
  };
</script>

<div class="flex gap-4">
  <Card.Root class="flex-1">
    <Card.Header>
      <div class="flex justify-between">
        <Card.Title>Generate Random</Card.Title>

        <Button size="sm" variant="default" onclick={regenerate}>
          Refresh

          <RefreshCw />
        </Button>
      </div>
    </Card.Header>

    <Card.Content class="flex flex-col gap-5">
      <div class="flex gap-2">
        <InformationInput title="V4 Random UUID" value={randomUUIDs.v4} />
      </div>

      <div class="flex gap-2">
        <InformationInput title="V3" value={forV3.value} />

        <InformationInput
          title="Name"
          bind:value={forV3.name}
          foreGroundText="For v3"
          readonly={false}
        />

        <InformationInput
          title="Namespace"
          bind:value={forV3.namespace}
          foreGroundText="For v3"
          readonly={false}
        />
      </div>

      <div class="flex gap-2">
        <InformationInput title="V5" value={forV5.value} />

        <InformationInput
          title="Name"
          bind:value={forV5.name}
          foreGroundText="For v5"
          readonly={false}
        />

        <InformationInput
          title="Namespace"
          bind:value={forV5.namespace}
          foreGroundText="For v5"
          readonly={false}
        />
      </div>

      <div class="flex gap-2">
        <InformationInput title="V1" value={randomUUIDs.v1} />
        <InformationInput title="V6" value={randomUUIDs.v6} />
        <InformationInput title="V7" value={randomUUIDs.v7} />
      </div>

      <div class="flex gap-2">
        <InformationInput title="MAX" value={MAX} />
        <InformationInput title="NIL" value={NIL} />
      </div>
    </Card.Content>
  </Card.Root>
</div>

<div class="flex gap-4">
  <Card.Root class="w-[450px] flex flex-col mt-3 h-fit">
    <Card.Header class="flex-row justify-between">
      <Card.Title>Parse UUID</Card.Title>
    </Card.Header>

    <Card.Content class="flex-1">
      <InformationInput
        bind:value={input}
        readonly={false}
        erroMsg={errorMessage}
        title="UUID"
        foreGroundText={inputVersion ? `UUID Version: ${inputVersion}` : ""}
        placeholder="Enter uuid here..."
      />
    </Card.Content>
  </Card.Root>

  <Card.Root class="flex flex-col flex-1 mt-3">
    <Card.Header class="flex-row justify-between">
      <Card.Title class="flex gap-1">
        Generate Multiple
        <Popover.Root>
          <Popover.Trigger>
            <CircleHelp class="text-muted-foreground" size={16} />
          </Popover.Trigger>
          <Popover.Content preventScroll={true} side="top">
            Keep in mind for generating <span class="text-red-400 font-bold">
              v3
            </span>
            and
            <span class="text-red-400 font-bold">v5</span> UUIDs, the name will
            be used from input provided in
            <span class="text-red-400 font-bold">Generate Random</span> card and
            for namespace it will be generated randomly with v4
          </Popover.Content>
        </Popover.Root>
      </Card.Title>
    </Card.Header>

    <Card.Content class="flex-1 flex items-end gap-2">
      <InformationInput
        bind:value={amountOfUUIDs}
        title="Amount"
        type="number"
        placeholder="Enter amount here..."
        readonly={false}
        erroMsg={errorMessage}
        foreGroundText={inputVersion ? `UUID Version: ${inputVersion}` : ""}
      />

      <div>
        <Label class="block pb-1.5 opacity-85 font-bold text-red-400">
          Select Version
        </Label>

        <Select.Root
          type="single"
          onValueChange={onVersionChange}
          value={selectedVersion.toString()}
        >
          <Select.Trigger class="w-[180px]">
            {availableVersions.find((e) => e.value === selectedVersion)?.label}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each availableVersions as e}
                <Select.Item value={e.value.toString()} label={e.label} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      <Button onclick={generateMultiple}>Generate</Button>
    </Card.Content>

    {#if generatedUUIDs.length}
      <Card.Content class="flex-1 flex flex-col pt-0 gap-2">
        {#each generatedUUIDs as uuid}
          <div>{uuid}</div>
        {/each}
      </Card.Content>
    {/if}
  </Card.Root>
</div>
