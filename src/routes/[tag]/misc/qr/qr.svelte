<script lang="ts">
  import encodeQR, { type ErrorCorrection, type Output, type QrOpts } from "qr";
  import { CircleHelp, RefreshCw } from "lucide-svelte";

  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import * as Popover from "$lib/components/ui/popover";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import InformationInput from "$lib/components/advanced-ui/input/information-input.svelte";

  import QrEccPopoverContent from "./qr-ecc-popover-content.svelte";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  type QrOutputType = Extract<Output, "svg" | "gif" | "ascii">;
  type ErrCorrectionLevelItem = { label: string; value: ErrorCorrection };

  let input = $state<string>("example");
  let outputType = $state<QrOutputType>("svg");
  let qrOpts = $state<QrOpts>({
    ecc: "medium",
    version: 7,
    mask: 0,
    scale: 1,
    encoding: "byte",
  });

  const outputTypes: QrOutputType[] = ["svg", "gif", "ascii"];
  const errCorrectionLvls: ErrCorrectionLevelItem[] = [
    { label: "low: 7%", value: "low" },
    { label: "medium: 15% (default)", value: "medium" },
    { label: "quartile: 25%", value: "quartile" },
    { label: "high: 30%", value: "high" },
  ];

  const reset = () => {
    outputType = "svg";
    input = "example";
    qrOpts = {
      ecc: "medium",
      version: 1,
      mask: 0,
      scale: 1,
    };
  };

  const setErrCorrectionLvl = (value: ErrorCorrection | string) => {
    let found = errCorrectionLvls.find((el) => el.value === value);
    qrOpts.ecc = found ? found.value : errCorrectionLvls[1].value;
  };

  const setOuputType = (value: QrOutputType) => {
    qrOpts.scale = value === "gif" ? 20 : 1;
    outputType = value;
  };

  const encorQrBetter = (
    text: string,
    output: "raw" | "ascii" | "term" | "gif" | "svg",
    opts?: QrOpts,
  ): { value: string | null; error: string | null } => {
    try {
      return { value: encodeQR(text, output as any, opts) as any, error: null };
    } catch (error) {
      if (error instanceof Error) {
        return { value: null, error: error.message };
      }

      return { value: null, error: "Unknown error" };
    }
  };

  const generatedQR: { value: string | null; error: string | null } =
    $derived.by(() => {
      const clonedOpts = Object.assign({}, qrOpts);
      const { mask, version } = clonedOpts;

      clonedOpts.mask = Math.min(
        7,
        Math.max(0, mask === null || mask === undefined ? 0 : mask),
      );
      clonedOpts.version = Math.min(
        40,
        Math.max(1, version === null || version === undefined ? 1 : version),
      );

      if (outputType === "ascii" || outputType === "svg") {
        const { error, value } = encorQrBetter(input, outputType, clonedOpts);

        if (error || !value) {
          return { value: null, error: error || "Error generating QR code" };
        }

        return { value, error: null };
      }

      const { value, error } = encorQrBetter(input, "gif", clonedOpts);
      if (error || !value) {
        return { value: null, error: error || "Error generating QR code" };
      }

      const bytes = new Blob([value], { type: "image/png" });
      const imgSrc = URL.createObjectURL(bytes);
      return { value: imgSrc, error: null };
    });
</script>

<div class="flex gap-4">
  <AdvancedCard
    class="w-[600px] min-w-[600px] mt-3 h-fit"
    contentClass="flex-1 flex flex-col gap-4"
    title="Input QR Parameters"
  >
    <div class="flex gap-2">
      <InformationInput
        bind:value={input}
        title="Text"
        placeholder="Enter text here..."
        readonly={false}
      >
        {#snippet nextToTitle()}
          <QrEccPopoverContent />
        {/snippet}
      </InformationInput>

      <div>
        <div class="flex items-center gap-1.5 pb-1.5">
          <Label class="block opacity-85 font-bold text-red-400">ECC</Label>

          <Popover.Root>
            <Popover.Trigger>
              <CircleHelp class="text-muted-foreground" size={16} />
            </Popover.Trigger>
            <Popover.Content
              preventScroll={true}
              side="right"
              class="w-[400px]"
            >
              Error Correction Code - a feature specific to QR Codes that
              ensures they are scannable, even if there has been some form of
              physical damage to the code.

              <ul class="list-disc list-inside pt-3">
                <li>Level L - 7% of data can be restored.</li>
                <li>Level M - 15% of data can be restored.</li>
                <li>Level Q - 25% of data can be restored.</li>
                <li>Level H - 30% of data can be restored.</li>
              </ul>
            </Popover.Content>
          </Popover.Root>
        </div>

        <Select.Root
          type="single"
          onValueChange={setErrCorrectionLvl}
          value={qrOpts.ecc}
        >
          <Select.Trigger class="w-[200px]">
            {errCorrectionLvls.find((e) => e.value === qrOpts.ecc)?.label}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each errCorrectionLvls as e}
                <Select.Item value={e.value.toString()} label={e.label} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>

    <div class="flex gap-2">
      <div class="flex-1">
        <Label class="block pb-1.5 opacity-85 font-bold text-red-400">
          Output Type
        </Label>

        <Select.Root
          type="single"
          onValueChange={(e) => setOuputType(e as QrOutputType)}
          value={outputType}
        >
          <Select.Trigger>
            {outputTypes.find((e) => e === outputType)}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each outputTypes as e}
                <Select.Item value={e} label={e} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      <InformationInput
        bind:value={qrOpts.version}
        title="Version"
        type="number"
        class="flex-1"
        placeholder="Enter version here..."
        foreGroundText="Available 1-40"
        readonly={false}
      />
    </div>

    <div class="flex gap-2">
      <InformationInput
        bind:value={qrOpts.mask}
        title="Mask"
        type="number"
        placeholder="Enter mask here..."
        foreGroundText="Available 0-7"
        readonly={false}
      />

      <InformationInput
        bind:value={qrOpts.scale}
        title="Scale"
        type="number"
        placeholder="Enter scale here..."
        foreGroundText="Scale equals 2, each block will be 2x2 pixels"
        readonly={outputType === "gif"}
        disabled={outputType === "gif"}
      />
    </div>

    <div class="flex justify-end">
      <Button size="sm" variant="default" onclick={reset}>
        Reset

        <RefreshCw />
      </Button>
    </div>
  </AdvancedCard>

  {#if input}
    <AdvancedCard title="Result" class="flex-1 mt-3 h-fit">
      {#snippet bellowContent()}
        {#if generatedQR.value}
          <Card.Content class="flex-1 p-3">
            {#if outputType === "ascii"}
              <pre class="font-mono rounded-xl">{generatedQR.value}</pre>
            {:else if outputType === "gif"}
              <img src={generatedQR.value} alt="" class="w-96 rounded-xl" />
            {:else}
              <div class="bg-white w-96 rounded-xl">
                {@html generatedQR.value}
              </div>
            {/if}
          </Card.Content>
        {:else}
          <Card.Content class="flex-1 p-3 rounded-xl">
            <p>{generatedQR.error}</p>
          </Card.Content>
        {/if}
      {/snippet}
    </AdvancedCard>
  {/if}
</div>
