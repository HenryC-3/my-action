import {Groups} from '../types'
import {Summary, parser} from '@conventional-commits/parser'
import {exec} from '@actions/exec'

export async function createContent() {
  const raw = await getRawMessages()
  return getSimpleComparison(getGroups(raw), getCurrentRepoURL())
}

export function getGroups(msgChunk: string): Groups {
  const groups = [] as Groups

  // 获取 commit message，形式为 SHA|Commit message，按提交的先后次序排列
  const lines = msgChunk.split('\n')

  // 将该 commit message 整理为数据结构 Group
  for (const line of lines) {
    const commitID = line.split('|')[0]
    const commitMsg = line.split('|')[1]

    // 检查 commitMsg 中是否有 `type: msg` 中的 type
    if (!isTypeExist(commitMsg)) continue

    const {type, text} = gitMessageParser(commitMsg)

    const exist = isGroupExist(type as string | undefined)

    // 该 type 存在，表示该组存在，将 commit id 和 commit message 存入该组
    if (type && exist) {
      const targetGroup = groups.filter(group => group.groupName === type)[0]
      targetGroup.commits.push({
        id: commitID,
        message: text ? text : ''
      })
    }

    // 该 type 不存在，表示改组不存在，新建组，再存入
    if (type && !exist) {
      groups.push({
        groupName: type,
        commits: [{id: commitID, message: text ? text : ''}]
      })
    }
  }

  // 返回 group
  return groups

  function isGroupExist(type: string | undefined) {
    if (!type) return false
    return groups.filter(group => group.groupName === type).length !== 0
  }

  function isTypeExist(str: string) {
    // https://regex101.com/r/doB7Rd/1
    return /.*(?=:)/.test(str)
  }
}

export function getSimpleComparison(groups: Groups, url: string) {
  let content = ''
  groups.forEach(group => {
    const linkName = group.groupName
    const first = group.commits[0].id
    const last = group.commits[group.commits.length - 1].id

    const link =
      `- [${linkName}](${url}/compare/${first}...${last}?diff=split)`.replace(
        "'",
        ''
      )
    content = content + link + '\n'
  })
  return content.trim()
}

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

/**
 * @description 返回以下形式的 git commit message
```text
0065fdf|拆分阶段:重构结束
bcb44c8|拆分阶段:拆分中转数据计算函数
e32dc9e|拆分阶段:使用中转数据
9cefe2d|split phase: extract function
d9b2cef|split phase: init
a3b491d|init
d1fa267|Initial commit
```
 */
export async function getRawMessages(): Promise<string> {
  let output = ''
  let error = ''

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      },
      stderr: (data: Buffer) => {
        error += data.toString()
      }
    }
  }

  await exec('git', ['log', "--pretty=format:'%h|%s'"], options)

  console.log('Output:', output)

  return output
}

// TODO
export function getCurrentRepoURL() {
  return `https://github.com/${process.env.GITHUB_REPOSITORY}`
}
