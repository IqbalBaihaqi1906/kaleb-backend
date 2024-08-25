import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(args: RegisterDto) {
    try {
      const { username, name, password } = args;

      const isExist = await this.prismaService.user.findFirst({
        where: {
          username,
        },
      });

      if (isExist) {
        throw new BadRequestException('User already exists');
      }

      const hashPassword = await bcrypt.hashSync(password, 10);

      const user = await this.prismaService.user.create({
        data: {
          username,
          name,
          password: hashPassword,
        },
      });

      return {
        id: user.id,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while creating the user',
        error.status || 500,
      );
    }
  }

  async login(args: LoginDto) {
    try {
      const { username, password } = args;

      const user = await this.prismaService.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid username or password');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new BadRequestException('Invalid username or password');
      }

      const jwtPayload = {
        id: user.id,
        username: user.username,
      };

      const accessToken = await this.jwtService.signAsync(jwtPayload);

      return {
        accessToken,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while logging in',
        error.status || 500,
      );
    }
  }
}
