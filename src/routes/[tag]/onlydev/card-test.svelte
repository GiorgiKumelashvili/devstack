<script lang="ts">
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";
</script>

<!-- Now use this advanced card everywhere refactor in all -->
<!-- also move advanced car backgroudn color in tailwind color and move every bg color to this color if posible -->
<AdvancedCard
  title="Card Test"
  opt2Value="123"
  onClear={() => {}}
  class="w-[600px]"
>
  <h1>hi</h1>
  <h1>hi</h1>
  <h1>hi</h1>
  <h1>hi</h1>
  <h1>hi</h1>
</AdvancedCard>
