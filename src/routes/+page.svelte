<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import TestDialog from "./test-dialog.svelte";
  import { buttonVariants } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  let greetMsg = $state("");
</script>

<h1>{greetMsg}</h1>
<Button onclick={() => (greetMsg = "Hello button clicked")}>Hello</Button>
<TestDialog />
<h1>Hello</h1>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline" })}>
    Open
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.Item>
          Profile
          <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Billing
          <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Settings
          <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Keyboard shortcuts
          <DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.Item>Team</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Email</DropdownMenu.Item>
            <DropdownMenu.Item>Message</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>More...</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Item>
          New Team
          <DropdownMenu.Shortcut>⌘+T</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>GitHub</DropdownMenu.Item>
      <DropdownMenu.Item>Support</DropdownMenu.Item>
      <DropdownMenu.Item>API</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>
        Log out
        <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>

{#each { length: 60 }}
  <p>Hello</p>
{/each}
