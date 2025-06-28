<script lang="ts">
  import { abcdef } from "@uiw/codemirror-themes-all";
  import { minimalSetup } from "codemirror";
  import { placeholder } from "@codemirror/view";

  import { cn, regex } from "$lib/utils";
  import { AdvancedInput } from "$lib/components/advanced-ui/input";
  import { Label } from "$lib/components/ui/label";
  import { AdvancedCodeMirror } from "$lib/components/advanced-ui/codemirror";
  import AdvancedCard from "$lib/components/advanced-ui/card/advanced-card.svelte";

  import TextInformationModal from "./components/text-information-modal.svelte";

  let value = $state("");

  const getCharCountsForEachLetter = (str: string): Record<string, number> => {
    const charCount: Record<string, number> = Object.create(null);

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      charCount[char] = (charCount[char] || 0) + 1;
    }

    return charCount;
  };

  const getCountForEachArrItem = (
    items: (string | number)[],
  ): Record<string, number> => {
    const itemCount: Record<string, number> = Object.create(null);

    for (let i = 0; i < items.length; i++) {
      const word = items[i].toString();
      itemCount[word] = (itemCount[word] || 0) + 1;
    }

    return itemCount;
  };

  const detectMostRepeatedWord = (uniqueWords: string[]) => {
    let mostRepeatedWord = "";
    let maxCount = 0;
    const frequency: Record<string, number> = {};

    for (let i = 0; i < uniqueWords.length; i++) {
      const word = uniqueWords[i];

      frequency[word] = (frequency[word] || 0) + 1;

      if (frequency[word] > maxCount) {
        mostRepeatedWord = word;
        maxCount = frequency[word];
      }
    }

    return {
      word: mostRepeatedWord,
      count: maxCount,
    };
  };

  let textInformation = $derived.by(() => {
    const globalAllWords: string[] = value.match(regex.globalAllLetter) || [];
    const wordCount = globalAllWords.length;
    const symbols =
      [...value].filter((char) => char.match(regex.symbols)) || [];

    const numbers = value.match(regex.numeric) || [];
    const uniqueWords = Array.from(new Set(globalAllWords));

    return {
      data: {
        totalCharCounts: getCharCountsForEachLetter(value),
        totalWordCounts: getCountForEachArrItem(globalAllWords),
        totalSymbolCounts: getCountForEachArrItem(symbols),
        totalNumberCounts: getCountForEachArrItem(numbers),
      },
      totalCharCount: value.length,
      totalCharCountWithoutSpace: value.replace(/\s/g, "").length,
      totalCharCountWithoutLineBreak: value.replace(/\n/g, "").length,
      totalCharCountWithouTabs: value.replace(/\t/g, "").length,
      wordCount,
      uniqueWordCount: uniqueWords.length,
      symbolCount: symbols.length, //
      uniqueSymbolCount: new Set(symbols).size, //
      numericCount: numbers.length, // each number
      lines: value.split("\n").length,
      linesWithoutBlankLines: (value.match(regex.nonBlankLines) || []).length,
      bytesCount: new Blob([value]).size,
      longestWord: uniqueWords.reduce(
        (a, b) => (a.length > b.length ? a : b),
        "",
      ),
      readingTime: Math.ceil(wordCount / 200),
      asciiNumber: value.charCodeAt(0),
      mostRepeatedWord: detectMostRepeatedWord(globalAllWords),
    };
  });
</script>

{#snippet InformationItem({
  title,
  value,
  foreGroundText,
  additionalInfo,
}: {
  title: string;
  value: string | number | boolean;
  foreGroundText?: string;
  additionalInfo?: Record<string, number>;
})}
  <div class="flex-1">
    <div
      class={cn(
        "flex items-center gap-1.5 pb-1.5",
        !additionalInfo && "h-[34px]",
      )}
    >
      <Label class="block opacity-85 font-bold text-red-400">
        {title}
      </Label>

      {#if additionalInfo}
        <TextInformationModal
          {title}
          data={additionalInfo}
          triggerButtonId="xxx"
        />
      {/if}
    </div>

    <AdvancedInput {value} readonly />

    {#if foreGroundText}
      <p class="text-muted-foreground text-sm">{foreGroundText}</p>
    {/if}
  </div>
{/snippet}

<div class="flex gap-4 max-h-[calc(100vh-5rem)]">
  <AdvancedCard
    title="Text Input"
    class="w-[550px]"
    opt2Value={value}
    onClear={() => (value = "")}
  >
    <AdvancedCodeMirror
      bind:value
      lineWrapping={true}
      theme={abcdef}
      basic={false}
      extensions={[minimalSetup, placeholder("Enter text here...")]}
      class="h-full border shadow rounded-xl custom-editor"
      onReady={(e) => {
        if (!e.hasFocus) {
          e.focus();
        }
      }}
    />
  </AdvancedCard>

  <AdvancedCard title="Text Information">
    <div class="flex gap-3">
      {@render InformationItem({
        title: "Character Count",
        value: textInformation.totalCharCount,
        foreGroundText: "Total characters",
        additionalInfo: textInformation.data.totalCharCounts,
      })}

      {@render InformationItem({
        title: "Character Count",
        value: textInformation.totalCharCountWithoutSpace,
        foreGroundText: "Exclude spaces",
      })}

      {@render InformationItem({
        title: "Character Count",
        value: textInformation.totalCharCountWithoutLineBreak,
        foreGroundText: "Exclude Line breaks",
      })}

      {@render InformationItem({
        title: "Character Count",
        value: textInformation.totalCharCountWithouTabs,
        foreGroundText: "Exclude tabs",
      })}
    </div>

    <div class="flex gap-3">
      {@render InformationItem({
        title: "Symbol Count",
        value: textInformation.symbolCount,
        additionalInfo: textInformation.data.totalSymbolCounts,
      })}

      {@render InformationItem({
        title: "Unique Symbol Count",
        value: textInformation.uniqueSymbolCount,
      })}

      {@render InformationItem({
        title: "Word Count",
        value: textInformation.wordCount,
        additionalInfo: textInformation.data.totalWordCounts,
      })}

      {@render InformationItem({
        title: "Unique Word Count",
        value: textInformation.uniqueWordCount,
      })}
    </div>

    <div class="flex gap-3">
      {@render InformationItem({
        title: "Numeric Count",
        value: textInformation.numericCount,
        additionalInfo: textInformation.data.totalNumberCounts,
      })}

      {@render InformationItem({
        title: "Byte Count",
        value: textInformation.bytesCount,
      })}

      {@render InformationItem({
        title: "Line Count",
        value: textInformation.lines,
      })}

      {@render InformationItem({
        title: "Line Count",
        value: textInformation.linesWithoutBlankLines,
        foreGroundText: "Exclude blank lines",
      })}
    </div>

    <div class="flex gap-3">
      {@render InformationItem({
        title: "Longest word",
        value: textInformation.longestWord,
      })}

      {@render InformationItem({
        title: "Reading Time",
        value: textInformation.readingTime + " minute",
        foreGroundText: `(${textInformation.wordCount}) Avg. 200-250 words per minute`,
      })}

      {@render InformationItem({
        title: "ASCII Number",
        value: textInformation.asciiNumber || "",
        foreGroundText: "Only for first letter",
      })}

      {@render InformationItem({
        title: "Repeated Words",
        value: textInformation.mostRepeatedWord.count
          ? `${textInformation.mostRepeatedWord.word}`
          : "None",
        foreGroundText: `${textInformation.mostRepeatedWord.count} times`,
      })}
    </div>
  </AdvancedCard>
</div>

<style>
  :global .custom-editor .cm-editor {
    height: 100%;
    border-radius: 10px !important;
    padding: 4px !important;
  }
</style>
