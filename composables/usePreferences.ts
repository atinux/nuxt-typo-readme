import type { BUNDLED_THEMES } from 'shiki-es'

export function usePreferences() {
  const syntaxHighlightTheme = useLocalStorage('syntaxHighlightTheme', 'github-dark' as typeof BUNDLED_THEMES[0])

  return {
    syntaxHighlightTheme
  }
}