<template>
  <a-layout
    ref="settingsMenuRef"
    class="settings-menu w-[450px] min-h-[200px] bg-[#4885e0]"
  >
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="!bg-[#fff] p-[14px] !w-[150px] !min-w-[150px] !max-w-[150px] !flex-auto"
    >
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :items="items"
        class="!w-[120px] !min-w-[120px]"
      >
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <search-config
          v-if="selectedKeys.includes(SelectedKeysEnum.Search)"
        ></search-config>
        <github-sync
          v-if="selectedKeys.includes(SelectedKeysEnum.Sync)"
        ></github-sync>
      </a-layout-content>
      <a-layout-content class="flex justify-end items-end mb-[10px] mr-[20px]">
        <a-affix :offset-bottom="0">
          <file-search-outlined
            class="cursor-pointer text-[#579fe4] text-[24px]"
            @click="emit('back', false)"
          />
        </a-affix>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import {
  SearchOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import { ItemType } from 'ant-design-vue/es/menu';
import SearchConfig from './components/search-config.vue';
import GithubSync from './components/github-sync.vue';

enum SelectedKeysEnum {
  Search = 'search',
  Sync = 'sync',
}

const selectedKeys = ref<string[]>([SelectedKeysEnum.Search]);
const collapsed = ref<boolean>(false);
const settingsMenuRef = ref();

const emit = defineEmits(['back']);

const items: ItemType[] = [
  {
    key: SelectedKeysEnum.Search,
    icon: () => h(SearchOutlined),
    label: '搜索',
  },
  {
    key: SelectedKeysEnum.Sync,
    icon: () => h(SyncOutlined),
    label: '同步',
  },
];
</script>

<style scoped lang="less">
.settings-menu {
  :deep(
      :where(.css-dev-only-do-not-override-3m4nqy).ant-menu-light
        .ant-menu-item-selected
    ) {
    background-color: #f4f7fc;
  }
  :where(
      .css-dev-only-do-not-override-3m4nqy
    ).ant-menu-light.ant-menu-root.ant-menu-inline,
  :where(
      .css-dev-only-do-not-override-3m4nqy
    ).ant-menu-light.ant-menu-root.ant-menu-vertical {
    border: none;
  }
}
</style>
