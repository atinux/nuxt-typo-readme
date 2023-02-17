<script setup lang="ts">
const router = useRouter()
const { owner, name } = useRoute().params
const { branch } = useRoute().query
const owner_repo = ref(owner && name ? `${owner}/${name}${branch ? `#${branch}` : ''}` : '')

async function goToRepo () {
  const [owner, name_branch] = owner_repo.value.split('/').map(_ => _.trim()).filter(_ => _)
  if (owner && name_branch) {
    const [ name, branch ] = name_branch.split('#')
    router.push({
      name: 'owner-name',
      params: { owner, name },
      query: { branch }
    })
  }
}
</script>

<template>
  <div class="container">
    <NuxtLoadingIndicator :duration="1000" />
    <nav>
      <NuxtLink to="/">
        <Icon name="ph:house-simple" />
      </NuxtLink>
      <button @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'" >
        <Icon name="ph:sun" v-if="$colorMode.preference === 'light'" />
        <Icon name="ph:moon" v-else />
      </button>
      <input type="text" v-model="owner_repo" placeholder="nuxt/framework" @keyup.enter="goToRepo"/>
      <a v-if="owner_repo && owner_repo === `${$route.params.owner}/${$route.params.name}`" :href="`https://github.com/${owner_repo}`" target="_blank" rel="noopener">
        <Icon name="carbon:logo-github" />
      </a>
    </nav>
    <NuxtPage class="page" />
  </div>
</template>

<style lang="ts">
css({
  html: {
    backgroundColor: '{color.white}',
    '&.dark': {
      backgroundColor: '{color.gray.900}',
    },
  },

  nav: {
    position: 'fixed',
    display: 'flex',
    top: '10px',
    left: '10px',
    alignItems: 'center',
    borderRadius: '{space.8}',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
    zIndex: 1000,
    'a, button': {
      display: 'flex',
      padding: '{space.2}',
      alignItems: 'center',
      cursor: 'pointer',
      color: '{color.gray.600}',
      '@dark': {
        color: '{color.gray.400}'
      },
      '&:hover': {
        color: '{color.gray.900}',
        '@dark': {
          color: '{color.gray.100}'
        }
      }
    },
    input: {
      border: '1px solid {color.gray.200}',
      padding: '{space.1} {space.2}',
      borderRadius: '3px',
      backgroundColor: 'transparent',
      '@dark': {
        borderColor: '{color.gray.700}'
      }
    }
  },

  '.page': {
    padding: '{space.16} {space.8}',
    minHeight: '100vh',
    maxWidth: '80ch',
    margin: 'auto'
  },
})
</style>