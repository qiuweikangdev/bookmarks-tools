<template>
  <a-layout-content>
    <slot :name="name"></slot>
  </a-layout-content>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ name: string }>(), {
  name: '',
});
</script>
