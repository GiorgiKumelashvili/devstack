<script lang="ts">
  import {
    SignJWT,
    jwtVerify,
    decodeJwt,
    decodeProtectedHeader,
    type JWTPayload,
    type JWTHeaderParameters,
    type ProtectedHeaderParameters,
  } from "jose";
  import { BadgeCheck, TriangleAlert } from "lucide-svelte";
  import { minimalSetup } from "codemirror";
  import { abcdef } from "@uiw/codemirror-themes-all";
  import { placeholder } from "@codemirror/view";
  import { json } from "@codemirror/lang-json";

  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card";
  import * as Alert from "$lib/components/ui/alert";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import { successToast } from "$lib/utils";
  import { type EitherVal } from "../../../types";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  type DecodedJWTValue = EitherVal<{
    payload: JWTPayload;
    protectedHeader: ProtectedHeaderParameters;
    isSignatureValid: boolean;
  }>;

  let tab = $state("decoder");

  // for decoding
  let jwtInput = $state("");
  let jwtSecret = $state("");

  // For encoding
  let secret = $state("a-string-secret-at-least-256-bits-long");
  let protectedHeaders = $state(`{\n  "alg": "HS256",\n  "type": "JWT"\n}`);
  let payload = $state(
    `{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "admin": true,\n  "iat": 1516239022\n}`,
  );

  const decoded: Promise<DecodedJWTValue> = $derived.by(async () => {
    try {
      if (!jwtInput && !jwtInput) {
        return { value: null, error: null };
      }

      const isSignatureValid = await jwtVerify(
        jwtInput,
        new TextEncoder().encode(jwtSecret),
      )
        .then(() => true)
        .catch(() => false);

      const protectedHeader = decodeProtectedHeader(jwtInput);
      const payload = decodeJwt(jwtInput);

      return {
        value: { payload, protectedHeader, isSignatureValid },
        error: null,
      };
    } catch (error) {
      console.log("=".repeat(20) + "error");
      console.log(error);
      return { value: null, error: "Error decoding JWT" };
    }
  });

  const encoded: Promise<EitherVal<string>> = $derived.by(async () => {
    try {
      const jwtSercret = new TextEncoder().encode(secret);
      const jwtPayload = JSON.parse(payload) as JWTPayload;
      const jwtProtectedHeaders = JSON.parse(
        protectedHeaders,
      ) as JWTHeaderParameters;

      const jwt = await new SignJWT(jwtPayload)
        .setProtectedHeader(jwtProtectedHeaders)
        .sign(jwtSercret);

      return { value: jwt, error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Error encoding JWT",
        value: null,
      };
    }
  });

  let isCopyIconActuallyActive = $state(false);
  const onCopy = async (value: string) => {
    isCopyIconActuallyActive = true;
    navigator.clipboard.writeText(value);
    successToast("Copied to clipboard");

    setTimeout(() => {
      isCopyIconActuallyActive = false;
    }, 1500);
  };
</script>

<div class="flex gap-4">
  <Tabs.Root value={tab} onValueChange={(e) => (tab = e)} class="w-[600px]">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="decoder">Decoder</Tabs.Trigger>
      <Tabs.Trigger value="encoder">Encoder</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="decoder">
      <AdvancedCard
        class="min-h-[370px]"
        contentClass="flex-1 flex flex-col gap-3 p-0 relative"
      >
        <div class="flex-1 overflow-auto">
          <AdvancedCodeMirror
            bind:value={jwtInput}
            lineWrapping={true}
            theme={abcdef}
            basic={false}
            extensions={[
              minimalSetup,
              placeholder("Enter jwt payload here..."),
            ]}
            class="h-full border-white custom-editor full-editor"
            onReady={(e) => {
              if (!e.hasFocus) {
                e.focus();
              }
            }}
          />
        </div>

        {#await decoded then result}
          {#if result.error || (jwtSecret && result.value?.isSignatureValid === false)}
            <Alert.Root
              variant="destructive"
              class="absolute z-10 bottom-3 left-3 right-3 w-auto"
            >
              <TriangleAlert class="h-4 w-4" />
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>
                {result.value ? "Invalid Signature" : result.error}
              </Alert.Description>
            </Alert.Root>
          {/if}
        {/await}

        {#await decoded then result}
          {#if jwtSecret && result.value?.isSignatureValid === true}
            <Alert.Root
              variant="default"
              class="absolute z-10 bottom-3 left-3 right-3 w-auto"
            >
              <BadgeCheck class="h-4 w-4" />
              <Alert.Title>Success</Alert.Title>
              <Alert.Description>Signature is valid</Alert.Description>
            </Alert.Root>
          {/if}
        {/await}
      </AdvancedCard>
    </Tabs.Content>

    <Tabs.Content value="encoder">
      <Card.Content
        class="min-h-[370px] flex-1 flex flex-col gap-4 overflow-auto p-0 pt-4"
      >
        <div class="flex flex-col flex-1">
          <Label class="block mb-2">Header: Algorithm & Token Type</Label>

          <AdvancedCodeMirror
            bind:value={protectedHeaders}
            lineWrapping={true}
            theme={abcdef}
            basic={false}
            readonly={false}
            extensions={[minimalSetup, json()]}
            class="border shadow rounded-md custom-editor h-full"
          />
        </div>

        <div class="flex flex-col flex-1">
          <Label class="block mb-2">Payload: Data</Label>

          <AdvancedCodeMirror
            bind:value={payload}
            lineWrapping={true}
            theme={abcdef}
            basic={false}
            readonly={false}
            extensions={[minimalSetup, json()]}
            class="border shadow rounded-md custom-editor h-full"
          />
        </div>

        <div class="flex flex-col">
          <Label class="block pb-2">JWT Signature</Label>

          <AdvancedCodeMirror
            bind:value={secret}
            lineWrapping={true}
            theme={abcdef}
            basic={false}
            readonly={false}
            extensions={[
              minimalSetup,
              placeholder("Enter the secret used to sign the JWT..."),
            ]}
            class="border shadow rounded-md custom-editor h-full flex-1"
          />
        </div>
      </Card.Content>
    </Tabs.Content>
  </Tabs.Root>

  <div class="flex flex-1 flex-col gap-4">
    <div class="flex flex-1 basis-0 flex-col h-fit">
      {#if tab === "decoder"}
        <Card.Content class="flex-1 flex flex-col gap-6 overflow-auto py-0">
          {#await decoded then result}
            <div class="flex flex-col flex-1">
              <Label class="block mb-2">Decoded Headers</Label>

              <AdvancedCodeMirror
                value={result.value
                  ? JSON.stringify(result.value.protectedHeader, null, 2)
                  : ""}
                lineWrapping={true}
                theme={abcdef}
                basic={false}
                readonly={true}
                extensions={[minimalSetup, json()]}
                class="border shadow rounded-md custom-editor h-full"
              />
            </div>
          {/await}

          {#await decoded then result}
            <div class="flex flex-col flex-1">
              <Label class="block mb-2">Decoded Payload</Label>

              <AdvancedCodeMirror
                value={result.value
                  ? JSON.stringify(result.value.payload, null, 2)
                  : ""}
                lineWrapping={true}
                theme={abcdef}
                basic={false}
                readonly={true}
                extensions={[minimalSetup, json()]}
                class="border shadow rounded-md custom-editor h-full"
              />
            </div>
          {/await}

          <div class="flex flex-col">
            <Label class="block pb-2">Secret</Label>

            <AdvancedCodeMirror
              bind:value={jwtSecret}
              lineWrapping={true}
              theme={abcdef}
              basic={false}
              readonly={false}
              extensions={[
                minimalSetup,
                placeholder("Enter the secret used to sign the JWT..."),
              ]}
              class="border shadow rounded-md custom-editor h-full"
            />
          </div>
        </Card.Content>
      {:else}
        <Card.Root class="flex overflow-auto flex-1 bg-[#0F0F0F]">
          <Card.Content class="w-full flex">
            <div class="flex-1 overflow-auto flex flex-col">
              <div class="flex justify-between items-center pb-3 h-10 pt-1">
                <Label class="block mb-2">JSON WEB TOKEN</Label>

                {#await encoded then result}
                  {#if result.value}
                    <Button
                      onclick={() => onCopy(result.value ?? "")}
                      variant="outline"
                      size="sm"
                    >
                      {isCopyIconActuallyActive ? "COPIED" : "COPY"}
                    </Button>
                  {/if}
                {/await}
              </div>

              {#await encoded then result}
                {#if result.value}
                  <textarea
                    class="w-full flex-1 font-mono bg-transparent font-thin text-sm outline-none resize-none"
                    readonly
                    name="jwt result">{result.value ?? ""}</textarea
                  >
                {/if}
              {/await}
            </div>

            {#await encoded then result}
              {#if result.error}
                <Alert.Root variant="destructive" class="h-fit">
                  <Alert.Description>
                    {result.error}
                  </Alert.Description>
                </Alert.Root>
              {/if}
            {/await}
          </Card.Content>
        </Card.Root>
      {/if}
    </div>
  </div>
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 10px !important;
    padding: 4px !important;
    max-height: none;
  }

  :global .encode-output-editor .cm-line {
    padding-left: 0 !important;
  }

  :global .full-editor .cm-content {
    padding: 10px;
  }
</style>
