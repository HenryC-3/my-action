import {gitMessageParser} from '../src/utils/gitMessageParser'
import {expect, test} from '@jest/globals'

test('should get object 1', () => {
  expect(JSON.stringify(gitMessageParser('test: result'))).toBe(
    JSON.stringify({type: 'test', text: 'result'})
  )
})

test('should get object when commit message contains Chinese', () => {
  expect(JSON.stringify(gitMessageParser('测试: 效果'))).toBe(
    JSON.stringify({type: '测试', text: '效果'})
  )
})

test('should get object when commit message contains - in type', () => {
  expect(JSON.stringify(gitMessageParser('测-试: 效果'))).toBe(
    JSON.stringify({type: '测-试', text: '效果'})
  )
})

test('should get object without scope when commit message contains scopes in type', () => {
  expect(JSON.stringify(gitMessageParser('测-试(build): 效果'))).toBe(
    JSON.stringify({type: '测-试', text: '效果'})
  )
})
