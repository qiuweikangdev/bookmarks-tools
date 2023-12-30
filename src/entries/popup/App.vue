<template>
  <settings-menu
    v-if="showSettings"
    @back="showSettings = false"
  ></settings-menu>
  <search-select
    v-else
    @change="handleChange"
    @settings="showSettings = true"
    :data="bookmarksNodes"
  ></search-select>
</template>

<script setup lang="ts">
import SearchSelect from '~/components/search-select/index.vue';
import SettingsMenu from '~/components/settings-menu/index.vue';
import useBookmarks, { BookmarksType } from '~/hooks/useBookmarks';
import { ref } from 'vue';
import useStore from '~/hooks/useStore';

const { enablePinyin } = useStore();
const { findBookmarkNodes } = useBookmarks();

const bookmarksNodes = ref<BookmarksType[]>([]);

const showSettings = ref(false);

const handleChange = (bookmark: string) => {
  const nodes = findBookmarkNodes({
    searchValue: bookmark,
    enablePinyin: enablePinyin.value,
  });
  bookmarksNodes.value = nodes;
};
</script>
