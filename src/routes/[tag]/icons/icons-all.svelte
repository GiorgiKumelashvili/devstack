<script lang="ts">
  import { Icon, icons } from "lucide-svelte";
  const svelteLucideIcons: [string, typeof Icon][] = Object.entries(icons);
</script>

<div class="grid grid-cols-12 gap-9">
  {#each svelteLucideIcons as [name, Component] (name)}
    <div
      class="flex h-full w-full flex-col items-center justify-center rounded-md border border-input p-6 hover:bg-slate-600 cursor-pointer"
    >
      <Component size={28} strokeWidth={2} />
    </div>
  {/each}
</div>
