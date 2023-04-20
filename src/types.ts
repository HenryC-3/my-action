export type Groups = Array<{
  groupName: string
  commits: Array<Commit>
}>
type Commit = {
  message: string
  id: string
}
