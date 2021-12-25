<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import { dequal } from "dequal/lite";
  import SearchInput from "./SearchInput.svelte";
  import Chip from "./Chip.svelte";
  import { editDistance, getTagSuggestions } from "../../libs/utils";
  import { SearchType } from "../../types";
  import type { ISearchQuery, ISuggestion } from "../../types";
  import { useMyInfo, useSessionid } from "../../queries";

  export let queries: ISearchQuery[];
  export let modified: boolean = false;
  let currentQuery: string = "";

  const [sessionid] = useSessionid();
  const [me, getMyInfo] = useMyInfo();

  const dispatch = createEventDispatcher();

  const submit = () => {
    dispatch("submit");
  };

  const notDuplicate = (suggestion: ISuggestion) =>
    queries.every((query) => !dequal(query, suggestion));

  const getSuggestions = ({ not, types, value }: ISearchQuery): ISuggestion[] => {
    const genSuggestion = (arg: {
      types?: SearchType;
      value: string;
      caption: string;
      score?: number;
    }): ISuggestion => ({
      not,
      types: arg.types ?? types,
      value: (not ? "!" : "") + arg.value,
      caption: arg.caption + (not ? " (제외)" : ""),
      score: arg.score ?? 0,
    });

    if (types === SearchType.Title && value === "")
      return [
        genSuggestion({
          types: SearchType.Tag,
          value: "#",
          caption: "태그로 검색",
        }),
        genSuggestion({
          types: SearchType.Contest,
          value: "&",
          caption: "대회로 검색",
        }),
        genSuggestion({
          types: SearchType.User,
          value: "@",
          caption: "푼 사람으로 검색",
        }),
        genSuggestion({
          types: SearchType.Level,
          value: "..",
          caption: "문제 레벨로 검색",
        }),
        genSuggestion({
          types: SearchType.Solves,
          value: ",,",
          caption: "푼 사람 수로 검색",
        }),
      ];

    switch (types) {
      case SearchType.Tag:
        return getTagSuggestions(value)
          .filter(notDuplicate)
          .map((suggestion) => genSuggestion({ ...suggestion, value: "#" + suggestion.value }));
      case SearchType.Contest:
        return [
          genSuggestion({
            value: "&" + value,
            caption: "대회의 문제",
          }),
        ];
      case SearchType.User:
        if ($me.isSuccess)
          return [
            genSuggestion({
              value: "@" + $me.data.username,
              caption: "내가 푼 문제",
              score: editDistance(value, $me.data.username),
            }),
          ].concat(
            value === ""
              ? []
              : [
                  genSuggestion({
                    value: "@" + value,
                    caption: "가 푼 문제",
                  }),
                ]
          );
        return [];
      case SearchType.Level:
        return [5, 10, 15, 20, 5, 10, 15, 20].map((level, index) =>
          index >= 4
            ? genSuggestion({
                value: ".." + level,
                caption: level + "레벨 이하 문제",
              })
            : genSuggestion({
                value: level + "..",
                caption: level + "레벨 이상 문제",
              })
        );
      case SearchType.Solves:
        return [
          genSuggestion({
            value: ",,0",
            caption: "아무도 풀지 못한 문제",
          }),
        ].concat(
          [1, 5, 10, 1, 5, 10].map((solves, index) =>
            index < 3
              ? genSuggestion({
                  value: ",," + solves,
                  caption: solves + "명 이하가 푼 문제",
                })
              : genSuggestion({
                  value: solves + ",,",
                  caption: solves + "명 이상이 푼 문제",
                })
          )
        );
      case SearchType.Title:
        return [
          genSuggestion({
            value,
            caption: "제목으로 검색",
          }),
        ];
      default:
        return [];
    }
  };

  const applySuggestion = ({ detail: suggestion }: CustomEvent<ISuggestion>) => {
    if (currentQuery === "") {
      if (suggestion.value === "" && suggestion.types === SearchType.Title) submit();
      else currentQuery = suggestion.value;
      return;
    }
    queries = [...queries, suggestion];
    modified = true;
  };

  const removeQuery = (removed: ISearchQuery) => {
    queries = queries.filter((query) => !dequal(query, removed));
    modified = true;
  };

  $: if (!!$sessionid.data) getMyInfo();
</script>

<div>
  {#each queries as query}
    <Chip on:click={() => removeQuery(query)}>{query.value}</Chip>
  {/each}
</div>
<SearchInput
  placeholder={$_("problem.searchQuery")}
  suggest={getSuggestions}
  bind:query={currentQuery}
  on:add={applySuggestion}
  on:submit={submit}
/>

<style>
  div {
    position: relative;
    display: block;
    margin: 0.375em;
    /* border: 0.0625em solid rgba(var(--text-color), calc(var(--background-opacity) * 5)); */
    border-radius: 0.25em;
    cursor: text;
  }
</style>
