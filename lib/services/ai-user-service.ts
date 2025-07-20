import { prisma } from '@/lib/prisma'

export class AIUserService {
  private static readonly AI_ROLE_NAME = 'AI'

  static async getAIUser(): Promise<string> {
    const aiUser = await prisma.system_users.findFirst({
      where: {
        system_enum_roles: {
          name: this.AI_ROLE_NAME
        }
      },
      include: {
        system_enum_roles: true
      }
    })

    if (!aiUser) {
      throw new Error(`User with role '${this.AI_ROLE_NAME}' not found`)
    }

    return aiUser.id
  }
}
