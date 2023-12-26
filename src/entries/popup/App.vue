<template>
  <search-select @change="onChange" :data="bookmarksNodes"></search-select>
</template>

<script setup lang="ts">
import SearchSelect from '~/components/search-select/index.vue';
import useBookmarks, { BookmarksType } from '~/hooks/useBookmarks';
import { ref } from 'vue';

const { findBookmarkNodes } = useBookmarks();

const bookmarksNodes = ref<BookmarksType[]>([]);

const onChange = (bookmark: string) => {
  const nodes = findBookmarkNodes(bookmark);
  bookmarksNodes.value = nodes;
};
</script>
