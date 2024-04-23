<template>
  <a-layout
    ref="settingsMenuRef"
    class="settings-menu w-[500px] min-h-[200px] bg-[#4885e0]"
  >
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="!bg-[#fff] p-[14px] !w-[160px] !min-w-[150px] !max-w-[150px] !flex-auto"
    >
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :items="items"
        class="!w-[130px] !min-w-[130px]"
      >
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <layout-content :name="menuKey">
        <template #[SelectedKeysEnum.Search]>
          <search-config></search-config>
        </template>
        <template #[SelectedKeysEnum.Sync]>
          <github-sync></github-sync>
        </template>
        <template #[SelectedKeysEnum.Version]>
          <history-version></history-version>
        </template>
      </layout-content>
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
import { ref, h, computed } from 'vue';
import {
  SearchOutlined,
  FileSearchOutlined,
  SyncOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons-vue';
import { ItemType } from 'ant-design-vue/es/menu';
import LayoutContent from '~/components/layout-content/index.vue';
import SearchConfig from './components/search-config.vue';
import GithubSync from './components/github-sync.vue';
import HistoryVersion from './components/history-version.vue';
enum SelectedKeysEnum {
  Search = 'search',
  Sync = 'sync',
  Version = 'Version',
}

const selectedKeys = ref<string[]>([SelectedKeysEnum.Sync]);
const collapsed = ref<boolean>(false);
const settingsMenuRef = ref();

const emit = defineEmits(['back']);

const menuKey = computed(() => selectedKeys.value[0] || SelectedKeysEnum.Sync);

const items: ItemType[] = [
  {
    key: SelectedKeysEnum.Sync,
    icon: () => h(SyncOutlined),
    label: '同步设置',
  },
  {
    key: SelectedKeysEnum.Version,
    icon: () => h(FieldTimeOutlined),
    label: '历史版本',
  },
  {
    key: SelectedKeysEnum.Search,
    icon: () => h(SearchOutlined),
    label: '搜索设置',
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
