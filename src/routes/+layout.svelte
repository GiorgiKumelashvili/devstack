<script lang="ts">
  import "../app.css";

  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb";
  import { Separator } from "$lib/components/ui/separator";
  import * as Sidebar from "$lib/components/ui/sidebar";
  import { toggleMode } from "mode-watcher";
  import { ModeWatcher } from "mode-watcher";

  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { Button } from "$lib/components/ui/button";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  let { children } = $props();
</script>

<ModeWatcher />

<Sidebar.Provider>
  <AppSidebar />

  <Sidebar.Inset>
    <header
      class="flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
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
              <Breadcrumb.Link href="#">
                Building Your Application
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="hidden md:block" />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
            </Breadcrumb.Item>
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
