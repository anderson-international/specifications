export function slug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\u2019'"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
