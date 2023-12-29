<template>
  <div class="w-[400px] p-[12px] bg-[#f5f4f1]">
    <a-select
      ref="searchRef"
      v-model:value="searchValue"
      size="large"
      :not-found-content="null"
      :filter-option="false"
      show-search
      popup-class-name="max-h-[400px] min-h-[40px] !top-[40px]"
      style="width: 100%"
      :options="data"
      :get-popup-container="(triggerNode) => triggerNode.parentElement"
      :list-height="400"
      :open="open"
      autofocus
      :field-names="{ label: 'title', value: 'id' }"
      @search="handleSearch"
      @blur="handleBlur"
      @keydown.enter="handleKeydown"
      @select="handleSelect"
    >
      <template #suffixIcon>
        <setting-outlined
          class="text-[#579fe4] text-[16px]"
          @click="handleSettings"
        />
      </template>
      <template #option="{ url, title, favicon, fullParentPath }">
        <div class="flex items-center my-[6px]" @click="handleLink(url)">
          <img :src="favicon" width="16" height="16" />
          <div class="flex flex-col px-[12px]">
            <span class="text-[14px] text-[#1d1c1c]/90 font-semibold">
              {{ title }}
            </span>
            <span
              v-if="store.showURL"
              class="text-[12px] text-[#1d1c1c] overflow-hidden text-ellipsis whitespace-nowrap py-[2px]"
              >{{ url }}
            </span>
            <span
              v-if="store.showFullParentPath"
              class="text-[12px] text-[#4e5969] overflow-hidden text-ellipsis whitespace-nowrap py-[2px]"
              >{{ fullParentPath }}
            </span>
          </div>
        </div>
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';
import { RefSelectProps } from 'ant-design-vue/es/select';
import { SettingOutlined } from '@ant-design/icons-vue';
import useStore from '~/hooks/useStore';
const { store } = useStore();

type Props = {
  data: DefaultOptionType[];
};

withDefaults(defineProps<Props>(), {
  data: () => {
    return [];
  },
});

const emit = defineEmits(['change', 'settings']);

const searchValue = ref('');
const searchRef = ref<RefSelectProps>();
const open = ref(false);
const selectItem = reactive<any>({});

const handleSearch = (value: string) => {
  searchValue.value = value;
  emit('change', value);
  open.value = Boolean(value);
};

const handleBlur = () => {
  if (searchRef.value) {
    searchRef.value.focus();
  }
};

const handleLink = (url: string) => {
  window.open(url);
};

const handleKeydown = () => {
  handleLink(selectItem.url);
};

const handleSelect = (_: any, option: any) => {
  Object.assign(selectItem, option);
};

const handleSettings = () => {
  emit('settings');
};
</script>
