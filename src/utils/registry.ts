export function getRegistryUrl(item: string) {
  return `/r/${item}.json`
}

export function getRegistryImportPath(item: string) {
  return `@/components/${item}`
}
