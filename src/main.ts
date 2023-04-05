import {getGroups} from './utils/getGroups'
import {getSimpleComparison} from './utils/getSimpleComparison'
import {rawMessages} from './utils/getFormattedGitMessages'
import {createComparisonMD} from './utils/createComparisonMD'

async function run() {
  const str = getSimpleComparison(getGroups(await rawMessages()), '')

  createComparisonMD(str)
}

run()
