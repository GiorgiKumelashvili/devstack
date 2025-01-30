<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";

  // import { Input } from "$lib/components/ui/input";
  // import {
  //   type SuperValidated,
  //   type Infer,
  //   superForm,
  // } from "sveltekit-superforms";
  // import { zodClient } from "sveltekit-superforms/adapters";

  let test1 = $state(123);
  let test2 = $state(321);

  let form = "" as any;
</script>

<div>
  <Form.Field {form} name="test1">
    <Form.Control let:attrs>
      <Form.Label>Test 1</Form.Label>
      <Input {...attrs} bind:value={test1} />
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="test2">
    <Form.Control let:attrs>
      <Form.Label>Test 2</Form.Label>
      <Input {...attrs} bind:value={test2} />
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>

<!-- <form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control let:attrs>
      <Form.Label>Username</Form.Label>
      <Input {...attrs} bind:value={$formData.username} />
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form> -->
