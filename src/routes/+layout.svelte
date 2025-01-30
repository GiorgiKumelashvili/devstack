<script lang="ts">
  import "../app.css";

  import { toggleMode } from "mode-watcher";
  import { ModeWatcher } from "mode-watcher";
  import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-svelte";
  import { page } from "$app/state";
  import { findTagTitle } from "$state/util-items.svelte";

  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import { Separator } from "$lib/components/ui/separator";
  import { Button } from "$lib/components/ui/button";
  import { Toaster } from "$lib/components/ui/sonner";

  let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

<Sidebar.Provider>
  <AppSidebar />

  <Sidebar.Inset>
    <header class="header">
      <div class="flex flex-1 items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />

        <Button
          variant="ghost"
          onclick={() => history.back()}
          size="icon"
          class="h-7 w-7"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          onclick={() => history.forward()}
          size="icon"
          class="h-7 w-7"
        >
          <ChevronRight />
        </Button>

        <Separator orientation="vertical" class="mr-2 h-4" />

        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item class="hidden md:block">
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>

            {#if page.params?.tag}
              <Breadcrumb.Separator class="hidden md:block" />
              <Breadcrumb.Item>
                <Breadcrumb.Page>
                  {findTagTitle(page.params.tag)}
                </Breadcrumb.Page>
              </Breadcrumb.Item>
            {/if}
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <Button
          onclick={() => toggleMode()}
          variant="outline"
          size="icon"
          class="ml-auto h-7 w-7"
        >
          <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>

    <!-- Root body -->
    <div class="p-4 pt-0 h-full overflow-y-auto">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
