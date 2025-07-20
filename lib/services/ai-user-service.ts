import { prisma } from '@/lib/prisma'

export class AIUserService {
  private static readonly AI_USER_EMAIL = 'ai@ail.im'

  static async getAIUser(): Promise<string> {
    const aiUser = await prisma.system_users.findUnique({
      where: { email: this.AI_USER_EMAIL },
    })

    if (!aiUser) {
      throw new Error('AI user not found')
    }

    return aiUser.id
  }
}
