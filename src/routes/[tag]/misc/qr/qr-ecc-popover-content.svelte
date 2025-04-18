<script lang="ts">
  import * as Popover from "$lib/components/ui/popover";
  import { CircleHelp } from "lucide-svelte";
</script>

<Popover.Root>
  <Popover.Trigger>
    <CircleHelp class="text-muted-foreground" size={16} />
  </Popover.Trigger>
  <Popover.Content preventScroll={true} side="right" class="w-[400px]">
    Keep in mind for each version of QR code and ecc, input will have different
    character limit
    <br />
    <div class="overflow-x-auto p-4">
      <h2 class="text-xl font-semibold mb-3">Few Examples</h2>
      <table class="min-w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr>
            <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              Version (Size)
            </th>
            <th
              class="border border-gray-300 px-3 py-2 text-left font-semibold"
            >
              ECC Level
            </th>
            <th
              class="border border-gray-300 px-3 py-2 text-right font-semibold"
            >
              Byte (8-bit)*
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td
              class="border border-gray-300 px-3 py-1 align-top row-span-3 font-medium"
            >
              1 (21x21)
            </td>

            <td class="border border-gray-300 px-3 py-1">L (~7%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">17</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">M (~15%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">14</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">Q (~25%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">11</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">H (~30%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">8</td>
          </tr>

          <tr>
            <td
              class="border border-gray-300 px-3 py-1 align-top row-span-4 font-medium"
            >
              5 (37x37)
            </td>

            <td class="border border-gray-300 px-3 py-1">L (~7%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">64</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">M (~15%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">51</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">Q (~25%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">36</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">H (~30%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">26</td>
          </tr>

          <tr>
            <td
              class="border border-gray-300 px-3 py-1 align-top row-span-4 font-medium"
            >
              10 (57x57)
            </td>

            <td class="border border-gray-300 px-3 py-1">L (~7%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">152</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">M (~15%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">120</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">Q (~25%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">85</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">H (~30%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">66</td>
          </tr>

          <tr>
            <td
              class="border border-gray-300 px-3 py-1 align-top row-span-4 font-medium"
            >
              40 (177x177)
            </td>

            <td class="border border-gray-300 px-3 py-1">L (~7%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">2953</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">M (~15%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">2331</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">Q (~25%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">1663</td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-3 py-1"></td>
            <td class="border border-gray-300 px-3 py-1">H (~30%)</td>
            <td class="border border-gray-300 px-3 py-1 text-right">1273</td>
          </tr>
        </tbody>
      </table>

      <div class="text-xs text-gray-600 mt-3">
        * Byte: Assumes 1 byte per character (e.g., ISO-8859-1). UTF-8
        characters may require 1-4 bytes each, reducing total character count
        significantly.
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
