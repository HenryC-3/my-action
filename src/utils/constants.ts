export function getToken() {
  const token = process.env.GITHUB_TOKEN as string
  if (!token) throw 'GITHUB_TOKEN is not configured yet'
  return token
}

export const filePath = 'compare.md'
