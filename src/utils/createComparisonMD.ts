import github from '@actions/github'
import fs from 'fs'

export async function createComparisonMD(content: string) {
  try {
    // Get the repository information from the context
    const repo = github.context.repo
    const owner = repo.owner
    const repoName = repo.repo
    const token = process.env.GITHUB_TOKEN as string
    if (!token) throw 'GITHUB_TOKEN is not configured yet'

    // Define the filename and content for the changelog
    const filename = 'compare.md'

    // Write the content to a file in the repository
    fs.writeFileSync(filename, content)

    // Create a new commit with the changelog file
    const octokit = github.getOctokit(token)
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: owner,
      repo: repoName,
      path: filename,
      message: 'update compare.md',
      content: Buffer.from(content).toString('base64')
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
