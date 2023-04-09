import {getGroups} from '../src/utils/createContent'
import {expect, test} from '@jest/globals'

const str1 = `bcb44c8|拆分阶段:拆分中转数据计算函数
e32dc9e|拆分阶段:使用中转数据`

test('should return groups', () => {
  expect(JSON.stringify(getGroups(str1))).toBe(
    JSON.stringify([
      {
        groupName: '拆分阶段',
        commits: [
          {
            id: 'bcb44c8',
            message: '拆分中转数据计算函数'
          },
          {
            id: 'e32dc9e',
            message: '使用中转数据'
          }
        ]
      }
    ])
  )
})

const str2 = `bcb44c8|拆分中转数据计算函数
e32dc9e|拆分阶段:使用中转数据`

test('should skip messages which do not contains type', () => {
  expect(JSON.stringify(getGroups(str2))).toBe(
    JSON.stringify([
      {
        groupName: '拆分阶段',
        commits: [
          {
            id: 'e32dc9e',
            message: '使用中转数据'
          }
        ]
      }
    ])
  )
})
