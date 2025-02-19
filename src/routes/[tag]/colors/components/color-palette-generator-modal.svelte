<script lang="ts" module>
  import { z } from "zod";

  export const formSchema = z.object({
    items: z.array(z.any()).refine((value) => value.length > 0, {
      message: "You have to select at least one item.",
    }),
  });
</script>

<script lang="ts">
  import Color from "color";
  import { zod } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";

  import * as Form from "$lib/components/ui/form/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { successToast } from "$lib/utils";

  type Props = {
    colors: Color[];
    isExportModalOpen: boolean;
    triggerButtonId: string;
  };

  let {
    colors,
    triggerButtonId,
    isExportModalOpen = $bindable(),
  }: Props = $props();

  const getForm = (items: Color[]) => {
    return superForm(
      { items: colors },
      {
        SPA: true,
        dataType: "json",
        validators: zod(formSchema),
        onUpdate({ form }) {
          const format = `[${form.data.items.map((e) => `"${e.hex()}"`).join(",")}]`;
          navigator.clipboard.writeText(format);
          successToast(`Copied to clipboard`);
          isExportModalOpen = false;
        },
      }
    );
  };

  const onCheckChange = (value: boolean, color: Color) => {
    if (value) {
      $formData.items = [...$formData.items, color];
    } else {
      $formData.items = $formData.items.filter((i) => i.hex() !== color.hex());
    }
  };

  let form = $state(getForm(colors));
  let formData = $derived.by(() => form.form);

  $effect(() => {
    form = getForm(colors);

    document.addEventListener("keypress", (e) => {
      if (e.key === "Space") {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
    });
  });
</script>

<Dialog.Root
  open={isExportModalOpen}
  onOpenChange={(open) => (isExportModalOpen = open)}
>
  <Dialog.Trigger
    class={buttonVariants({ variant: "outline" })}
    id={triggerButtonId}
    tabindex={-1}
  >
    Export
  </Dialog.Trigger>

  <Dialog.Content class="sm:max-w-[425px]">
    <form class="space-y-8 overflow-y-scroll" use:form.enhance>
      <Form.Fieldset {form} name="items" class="space-y-0">
        <div class="mb-4">
          <Form.Legend class="text-base">Export</Form.Legend>

          <Form.Description>
            Select the items you want to display in the sidebar.
          </Form.Description>
        </div>

        <div class="space-y-2">
          {#each colors as color}
            <div class="flex flex-row items-start space-x-3 min-h-fit">
              <Form.Control>
                {#snippet children({
                  props,
                }: {
                  props?: Record<string, unknown>;
                })}
                  {@const checked = $formData.items
                    .map((e) => e.hex())
                    .includes(color.hex())}

                  <Checkbox
                    {...props}
                    {checked}
                    value={color.hex()}
                    onCheckedChange={(v) => onCheckChange(v, color)}
                  />

                  <Form.Label
                    class="text-sm font-normal cursor-pointer"
                    onclick={() => onCheckChange(!checked, color)}
                  >
                    {color.hex()}
                  </Form.Label>
                {/snippet}
              </Form.Control>
            </div>
          {/each}
          <Form.FieldErrors />
        </div>
      </Form.Fieldset>

      <Form.Button>Copy</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
