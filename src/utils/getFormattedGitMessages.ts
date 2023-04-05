import {exec} from '@actions/exec'

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
export async function rawMessages(): Promise<string> {
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
  console.log('Error:', error)

  return output
}
