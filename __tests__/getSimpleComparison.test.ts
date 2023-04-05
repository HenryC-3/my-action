import {getSimpleComparison} from '../src/utils/getSimpleComparison'
import {expect, test} from '@jest/globals'

const testGroups = [
  {
    groupName: 'Group 1',
    commits: [
      {
        message: 'Commit 1',
        id: '1'
      },
      {
        message: 'Commit 2',
        id: '2'
      }
    ]
  },
  {
    groupName: 'Group 2',
    commits: [
      {
        message: 'Commit 3',
        id: '3'
      },
      {
        message: 'Commit 4',
        id: '4'
      }
    ]
  }
]

const str = `- [Group 1](https://github.com/user/repo/compare/1...2?diff=split)
- [Group 2](https://github.com/user/repo/compare/3...4?diff=split)`

test('should get markdown link list', () => {
  expect(getSimpleComparison(testGroups, 'https://github.com/user/repo')).toBe(
    str
  )
})
