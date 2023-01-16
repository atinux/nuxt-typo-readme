<script setup lang="ts">
const { owner } = useRoute().params
const { parse } = useMarkdown()

const { data, error } = await useAsyncData(owner, () => {
  return $fetch(`https://raw.githubusercontent.com/${owner}/.github/main/profile/README.md`)
    .then((readme: any) => parse({ content: readme }))
})
</script>

<template>
  <p v-if="error">{{ error }}</p>
  <main v-else>
    <ContentRendererMarkdown :value="data" />
  </main>
</template>
