<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})
const { owner, name } = useRoute().params
const source = computed(() => {
  if (props.src.startsWith('.')) {
    return `https://raw.githubusercontent.com/${owner}/${name}/main/${props.src}`
  }
  return props.src
})
</script>

<template>
  <img v-bind="$attrs" :src="source" :alt="alt" :width="width" :height="height">
</template>

<style lang="ts" scoped>
css({
  img: {
    maxWidth: '100%',
    display: 'inline-block',
    borderStyle: 'none'
  }
})
</style>