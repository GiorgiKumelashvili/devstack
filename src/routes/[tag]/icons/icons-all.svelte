<script lang="ts">
  import { Icon, icons } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { downloadSvg } from "$lib/utils";

  type SvelteLucideIcons = {
    id: string,
    icon: [string, typeof Icon]
  };

  const calculateId = (id: string) => `lucide-icon-downloadable-${id}`;
  const svelteLucideIcons: SvelteLucideIcons[] = Object.entries(icons).map(e => ({ id: calculateId(e[0]), icon: e }));

  const handleClick = (id: string, name: string) => {
    const icon = document.getElementById(id);

    if (!icon) {
      toast.warning("Icon not found");
      return;
    }

    downloadSvg(name, icon.outerHTML);
  };
</script>

<div class="grid grid-cols-12 gap-9">
  {#each svelteLucideIcons as { id, icon: [name, Component] } (name)}
    <button
      class="flex h-full w-full flex-col items-center justify-center rounded-md border border-input p-6 hover:bg-slate-600 cursor-pointer"
      onclick={() => handleClick(id, name)}
    >
      <Component size={28} strokeWidth={2} {id} />
    </button>
  {/each}
</div>
