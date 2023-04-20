import {createComparisonMD} from './utils/commitChanges'
import {createContent} from './utils/createContent'

async function run() {
  const content = await createContent()
  createComparisonMD(content)
}

run()
