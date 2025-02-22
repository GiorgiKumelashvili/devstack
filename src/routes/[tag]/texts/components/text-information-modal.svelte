<script lang="ts">
  import { Eye } from "lucide-svelte";

  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge";
  import { successToast } from "$lib/utils";

  type Props = {
    data: Record<string, number>;
    triggerButtonId: string;
    title: string;
  };

  enum SortBy {
    SYMBOL = "symbol",
    COUNT = "count",
  }

  let { triggerButtonId, data, title }: Props = $props();
  let sortBy = $state<SortBy>(SortBy.SYMBOL);

  const dataSorted = $derived.by(() => {
    if (sortBy === SortBy.SYMBOL) {
      return Object.entries(data).toSorted((a, b) => a[0].localeCompare(b[0]));
    } else if (sortBy === SortBy.COUNT) {
      return Object.entries(data).toSorted((a, b) => b[1] - a[1]);
    } else {
      return [];
    }
  });

  const copyBadgeText = (value: string) => {
    navigator.clipboard.writeText(value);
    successToast("Copied to clipboard");
  };
</script>

<Dialog.Root>
  <Dialog.Trigger
    class={buttonVariants({ variant: "ghost", class: "w-7 h-7", size: "icon" })}
    id={triggerButtonId}
    tabindex={-1}
  >
    <Eye />
  </Dialog.Trigger>

  <Dialog.Content
    class="sm:max-w-[825px] max-h-[600px] flex flex-col"
    dialogCloseTabIndex={-1}
  >
    <div class="flex justify-between">
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
          Total: {Object.values(data).reduce((a, b) => a + b, 0)}
        </Dialog.Description>
      </Dialog.Header>

      <Select.Root type="single">
        <Select.Trigger
          autofocus={false}
          tabindex={-1}
          class="w-[180px] h-8 mr-5">{sortBy}</Select.Trigger
        >

        <Select.Content>
          <Select.Group>
            <Select.GroupHeading>Sort by</Select.GroupHeading>
            {#each Object.values(SortBy) as item}
              <Select.Item
                value={item}
                label={item}
                onclick={() => (sortBy = item)}
              />
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <div class="grid grid-cols-4 overflow-y-auto">
      {#each dataSorted as [key, value]}
        <div class="flex items-center justify-between border-r pr-4">
          <Badge
            class="select-text cursor-pointer"
            onclick={() => copyBadgeText(key)}
          >
            "
            <p class="max-w-28 truncate block">{key}</p>
            "
          </Badge>

          <p class="pl-3">{value}</p>
        </div>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>
