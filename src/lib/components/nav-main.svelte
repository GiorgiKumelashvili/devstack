<script lang="ts">
  import clsx from "clsx";
  import { ChevronRight } from "lucide-svelte";
  import { page } from "$app/state";

  import * as Collapsible from "$lib/components/ui/collapsible";
  import * as Sidebar from "$lib/components/ui/sidebar";

  import { type UtilItem, type UtilSubItem } from "../../types";

  const { items }: { items: UtilItem[] } = $props();

  const isActive = (item: UtilSubItem) => {
    return item.tag === page.params?.tag;
  };
</script>

<Sidebar.Group>
  <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
  <Sidebar.Menu>
    {#each items as mainItem (mainItem.title)}
      <Collapsible.Root open={mainItem.isActive} class="group/collapsible">
        {#snippet child({ props })}
          <Sidebar.MenuItem {...props}>
            <Collapsible.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton {...props}>
                  {#snippet tooltipContent()}
                    {mainItem.title}
                  {/snippet}
                  {#if mainItem.icon}
                    <mainItem.icon />
                  {/if}
                  <span>{mainItem.title}</span>
                  <ChevronRight
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </Sidebar.MenuButton>
              {/snippet}
            </Collapsible.Trigger>
            <Collapsible.Content>
              {#if mainItem.items}
                <Sidebar.MenuSub>
                  {#each mainItem.items as subItem (subItem.title)}
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton
                        class={clsx(
                          isActive(subItem)
                            ? "bg-primary/10"
                            : "hover:bg-primary/5",
                        )}
                        href={subItem.tag}
                      >
                        <span>
                          {subItem.title}
                        </span>
                      </Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                  {/each}
                </Sidebar.MenuSub>
              {/if}
            </Collapsible.Content>
          </Sidebar.MenuItem>
        {/snippet}
      </Collapsible.Root>
    {/each}
  </Sidebar.Menu>
</Sidebar.Group>
