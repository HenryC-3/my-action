import {context, getOctokit} from '@actions/github'
import {writeFileSync, existsSync} from 'fs'
import {filePath, getToken} from './constants'

const {owner, repo: repo} = context.repo

// Get the repository information from the context
const token = getToken()
// Create a new commit with the changelog file
const octokit = getOctokit(token)

export async function createComparisonMD(content: string) {
  try {
    // Define the filename and content for the changelog
    // Write the content to a file in the repository
    if (existsSync(filePath)) writeFileSync(filePath, content)

    const sha = await getSHA()

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: owner,
      repo,
      path: filePath,
      sha, // 必须提供 sha 否则容易报错
      message: 'update compare.md',
      content: Buffer.from(content).toString('base64')
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

async function getSHA() {
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner,
      repo,
      path: filePath,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }
  )
  // TODO Don't know why the sha is not on the data [Repository contents - GitHub Docs](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content--parameters)
  // @ts-ignore
  return res.data.sha
}
