// origin file: https://github.com/jaywcjlove/rehype-video/blob/f006fbfe59060f504a80be15d2b20c4ed5d1d9e7/src/index.ts#L1

import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'

export type RehypeVideoOptions = {
  /**
   * iFrame video ratio.
   * @default 16/9
   */
  ratio: number
}

const videoProperties = { muted: 'muted', controls: 'controls', style: 'max-width:100%;' }
const iframeProperties = {
  frameborder: 0,
  webkitallowfullscreen: true,
  mozallowfullscreen: true,
  allowfullscreen: true,
  style: 'position: absolute; top: 32px; left: 0; width: 100%; height: 100%;'
}

export const RehypeVideo: Plugin<[RehypeVideoOptions?], Root> = (options) => {
  const ratio = options?.ratio || 16 / 9

  const validUrl = /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
  const videoUrls: { regex: RegExp, replace?: (url: string) => string, type?: string }[] = [
    // youtube
    { regex: /(https?:\/\/)(www\.)?youtube\.com\/embed\/[a-zA-Z0-9-_]+/g },
    { regex: /(https?:\/\/)(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9-_]+/g, replace: url => url.replace(/youtube\.com\/watch\?v=/g, 'youtube.com/embed/') },
    { regex: /(https?:\/\/)(www\.)?youtu\.be\/[a-zA-Z0-9-_]+/g, replace: url => url.replace(/youtu\.be/g, 'youtube.com/embed') },
    // loom
    { regex: /(https?:\/\/)(www\.)?loom\.com\/embed\/[a-zA-Z0-9]+/g },
    { regex: /(https?:\/\/)(www\.)?loom\.com\/share\/[a-zA-Z0-9]+/g, replace: url => url.replace(/loom\.com\/share\//g, 'loom.com/embed/') },
    // mp4
    { regex: /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\/[-a-zA-Z0-9@:%_+.~#?&//=]*\.mp4(\b[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi, type: 'video' },
    // mov
    { regex: /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\/[-a-zA-Z0-9@:%_+.~#?&//=]*\.mov(\b[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi, type: 'video' }
  ]

  return transform

  function transform (tree: Node) {
    visit(tree, 'element', (node: Node) => {
      if (['div', 'p', 'a'].includes(node.tagName) && node.children.length === 1) {
        const child = node.children[0]
        if (child.type === 'text') {
          const data = getValidUrl(child.value)
          if (data) {
            updateVideoNode(node, data.type, data.url)
          }
        }
      }
    })
  }

  function updateVideoNode (node: Node, videoType: string, url: string) {
    if (videoType === 'video') {
      node.type = 'element'
      node.tagName = 'video'
      node.properties = { ...videoProperties, src: url }
      node.children = []
    } else {
      node.tagName = 'div'
      node.properties = { style: `position: relative; width: 100%; padding-bottom: ${100 / ratio}%; margin-bottom: 64px;` }
      node.children = [{
        type: 'element',
        tagName: 'iframe',
        properties: {
          ...iframeProperties,
          src: url
        },
        children: []
      }]
    }
  }

  function getValidUrl (url: string) {
    if (url.match(validUrl) === null) {
      return null
    }

    for (const videoUrl of videoUrls) {
      if (url.match(videoUrl.regex)) {
        return {
          url: videoUrl.replace ? videoUrl.replace(url) : url,
          type: videoUrl.type || 'iframe'
        }
      }
    }

    return null
  }
}
