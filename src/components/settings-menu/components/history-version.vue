<template>
  <div>
    <a-spin :spinning="commitListLoading && !commitList.length">
      <a-form
        class="my-[12px] p-[20px]"
        layout="inline"
        :model="formData"
        :wrapper-col="{ style: { maxWidth: '150px' } }"
      >
        <div class="flex">
          <a-form-item name="username">
            <a-select
              :loading="commitListLoading"
              class="!w-[180px]"
              v-model:value="formData.version"
              placeholder="选择版本"
              allow-clear
              @focus="handleCommitList"
              :list-height="120"
              :options="commitList"
              :get-popup-container="(triggerNode) => triggerNode.parentElement"
              popup-class-name="max-h-[120px] min-h-[40px] !top-[40px]"
            >
            </a-select>
          </a-form-item>
          <a-form-item class="ml-[24px]">
            <a-button
              type="primary"
              @click="handleSwitchVersion"
              :disabled="!Boolean(formData.version)"
              :loading="versionLoading"
            >
              切换版本
            </a-button>
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>
<script setup lang="ts">
import { DefaultOptionType } from 'ant-design-vue/es/vc-select/Select';
import { ref, onMounted, reactive } from 'vue';
import useGithub from '~/hooks/useGithub';
import useStore from '~/hooks/useStore';
const { githubSync } = useStore();
const { commitListLoading, getCommitsList, switchVersion, versionLoading } =
  useGithub(githubSync.value);

const commitList = ref<DefaultOptionType[]>([]);
const formData = reactive({ version: undefined });

onMounted(() => {
  handleCommitList();
});

const handleCommitList = async () => {
  if (Object.values(githubSync.value).some((value) => !value)) {
    return;
  }
  const list = await getCommitsList();
  commitList.value = list || [];
};
const handleSwitchVersion = async () => {
  if (formData.version) {
    await switchVersion(formData.version);
  }
};
</script>
