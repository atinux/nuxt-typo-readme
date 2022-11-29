<script setup lang="ts">
const { owner, name } = useRoute().params
const branch = computed(() => useRoute().query.branch || 'main')
const repository = `${owner}/${name}`
const { parse } = useMarkdown()

const { data, error, refresh } = await useAsyncData(repository, () => {
  return $fetch(`https://raw.githubusercontent.com/${repository}/${branch.value}/README.md`)
    .then((readme: any) => parse({ content: readme, repository }))
})
watch(branch, refresh)
</script>

<template>
  <p v-if="error">{{ error }}</p>
  <main v-else>
    <ContentRendererMarkdown :value="data" />
  </main>
</template>
