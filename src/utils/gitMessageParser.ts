import {Summary, parser} from '@conventional-commits/parser'

export function gitMessageParser(msg: string) {
  const tree = parser(msg)

  const result = {} as {type: string; text: string}

  const summaries = tree.children.filter(
    child => child.type === 'summary'
  ) as Summary[]

  if (summaries.length !== 0) {
    summaries[0].children.forEach(node => {
      if (node.type === 'type') result.type = node.value
      //@ts-ignore
      if (node.type === 'text') result.text = node.value
    })
  }
  return result
}
