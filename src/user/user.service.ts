import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while retrieving the user',
        error.status || 500,
      );
    }
  }
}
