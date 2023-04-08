import {context, getOctokit} from '@actions/github'
import fs from 'fs'
import {filePath, getToken} from './constants'
import {execSync} from 'child_process'

const {owner, repo: repo} = context.repo

export async function createComparisonMD(content: string) {
  try {
    // Get the repository information from the context

    const token = getToken()

    // Define the filename and content for the changelog
    // Write the content to a file in the repository
    fs.writeFileSync(filePath, content)

    // Create a new commit with the changelog file
    const octokit = getOctokit(token)
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: owner,
      repo,
      path: filePath,
      sha: getSHA(), // 必须提供 sha 否则容易报错
      message: 'update compare.md',
      content: Buffer.from(content).toString('base64')
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

function getSHA() {
  const sha = execSync('git rev-parse HEAD', {encoding: 'utf8'}).trim()
  return sha
}
