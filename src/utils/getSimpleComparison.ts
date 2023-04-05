import {Groups} from '../types'

export function getSimpleComparison(groups: Groups, url: string) {
  let content = ''
  groups.forEach(group => {
    const linkName = group.groupName
    const first = group.commits[0].id
    const last = group.commits[group.commits.length - 1].id

    const link = `- [${linkName}](${url}/compare/${first}...${last}?diff=split)`
    content = content + link + '\n'
  })
  return content.trim()
}
