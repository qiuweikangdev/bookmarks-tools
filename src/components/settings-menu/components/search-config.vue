<template>
  <a-form
    class="p-[20px]"
    :model="formData"
    :label-col="{ style: { maxWidth: '150px', textAlign: 'left' } }"
    :wrapper-col="{ style: { maxWidth: '60px' } }"
  >
    <a-form-item label="拼音搜索" prop="use">
      <a-switch v-model:checked="formData.enablePinyin" />
    </a-form-item>
    <a-form-item label="展示URL" prop="showURL">
      <a-switch v-model:checked="formData.showURL" />
    </a-form-item>
    <a-form-item label="展示书签所在层级" prop="showFullParentPath">
      <a-switch v-model:checked="formData.showFullParentPath" />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import useStore from '~/hooks/useStore';

const { store: formData } = useStore();
</script>
