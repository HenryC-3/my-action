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
export async function rawMessages() {
  return (await exec(
    "git log --pretty=format:'%h|%s'"
  )) as unknown as Promise<string>
}
