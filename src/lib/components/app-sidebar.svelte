<script lang="ts">
  import { type ComponentProps } from "svelte";
  import { utilItems } from "$state/index";

  import * as Sidebar from "$lib/components/ui/sidebar";
  import NavMain from "$lib/components/nav-main.svelte";
  import NavWorkspace from "$lib/components/nav-workspace.svelte";

  let {
    ref = $bindable(null),
    collapsible = "icon",
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <!-- <Sidebar.Header>
    <TeamSwitcher teams={data.teams} />
  </Sidebar.Header> -->
  <Sidebar.Content>
    <NavMain items={utilItems} />
    <!-- <NavProjects projects={data.projects} /> -->
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavWorkspace />
  </Sidebar.Footer>
  <Sidebar.Rail />
</Sidebar.Root>
