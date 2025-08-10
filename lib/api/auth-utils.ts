import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
export function getBearerUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const userId = authHeader.substring(7).trim()
  return userId || null
}

export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false
  const user = await prisma.system_users.findUnique({
    where: { id: userId },
    select: { role_id: true },
  })
  return !!user && user.role_id === 1
}
