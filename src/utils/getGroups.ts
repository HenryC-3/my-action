import {Groups} from '../types'
import {gitMessageParser as parser} from './gitMessageParser'

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

    const {type, text} = parser(commitMsg)

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
