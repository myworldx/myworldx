export function SearchByExtensions(repositoryArr: string) {
  const repositoryArray = repositoryArr.split('.')
  if (repositoryArray.length < 2) {
    return false
  }

  const repositoryExtension = repositoryArray[repositoryArray.length - 1]

  if (__VALID_EXTENSIONS_MAP[repositoryExtension]?.valid) {
    return true
  }
  return false
}
