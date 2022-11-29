import { transformContent } from '@nuxt/content/transformers'
import remarkGithub from 'remark-github'
import rehypeExternalLinks from 'rehype-external-links'

export interface ParseOptions {
  id?: string
  content?: string
  repository?: string
  checkboxCallback?: (position: number, checked: boolean) => void
}

export const useMarkdown = () => {
  async function parse ({ id = 'content:_markdown.md', content = '', repository = undefined, checkboxCallback = undefined }: ParseOptions = {}) {
    const shiki = await useShiki()
    let parsed = await transformContent(id, content, {
      markdown: {
        remarkPlugins: {
          ...repository
            ? {
                'remark-github': {
                  instance: remarkGithub,
                  repository,
                  mentionStrong: false,
                  buildUrl (values: any, defaultBuildUrl: any) {
                    if (values.type === 'issue') {
                      return `/${values.user}/${values.project}/issues/${values.no}`
                    } else if (values.type === 'mention') {
                      return `/${values.user}`
                    }

                    return defaultBuildUrl(values)
                  }
                }
              }
            : {}
        },
        rehypePlugins: {
          'rehype-external-links': {
            instance: rehypeExternalLinks,
            target: '_blank',
            rel: ['nofollow', 'noopener', 'noreferrer']
          },
          'rehype-video': {
            instance: RehypeVideo
          }
        }
      }
    })
    parsed = await shiki(parsed)

    return parsed
  }

  return {
    parse
  }
}
