export function validateUUID(id: string | null): string | null {
  if (!id) return 'User ID is required'
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) return `Invalid userId format: expected UUID, got '${id}'`
  return null
}
