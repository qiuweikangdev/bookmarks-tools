<template>
  <div>
    <github-outlined
      class="w-full justify-center text-[32px] py-[12px] text-[#1677ff]"
    />
    <a-spin :spinning="syncLoading">
      <a-form
        class="p-[20px]"
        :model="formData"
        :label-col="{ style: { maxWidth: '120px', textAlign: 'left' } }"
        :wrapper-col="{ style: { maxWidth: '140px' } }"
      >
        <a-form-item label="Username" name="username">
          <a-input v-model:value="formData.username" />
        </a-form-item>
        <a-form-item label="Access Token" name="accessToken">
          <a-input type="password" v-model:value="formData.accessToken" />
        </a-form-item>
        <a-form-item label="Repository Name" name="repositoryName">
          <a-input v-model:value="formData.repositoryName" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
          <a-button
            :icon="h(CloudUploadOutlined)"
            class="px-[24px]"
            type="primary"
            @click="uploadGithub"
          >
            上传
          </a-button>
          <a-button
            :icon="h(CloudDownloadOutlined)"
            class="px-[24px]"
            style="margin-left: 10px"
            >下载
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>
<script setup lang="ts">
import { h } from 'vue';
import {
  GithubOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons-vue';
import useBookmarks from '~/hooks/useBookmarks';
import useGithub from '~/hooks/useGithub';
import useStore from '~/hooks/useStore';
const { githubSync: formData } = useStore();
const { syncLoading, syncBookmarks } = useGithub(formData.value);
const { bookmarksTree } = useBookmarks();
import dayjs from 'dayjs';

const uploadGithub = async () => {
  await syncBookmarks({
    bookmarksData: bookmarksTree.value,
    commitMessage: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    path: 'bookmarks1',
  });
};
</script>
