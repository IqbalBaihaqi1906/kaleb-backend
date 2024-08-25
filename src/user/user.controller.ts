import {
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  async getUserById(id: string) {
    const data = await this.userService.getUserById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been retrieved successfully',
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('user-by-token')
  async getUserByToken(@Request() req) {
    const data = await this.userService.getUserById(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been retrieved successfully',
      data,
    };
  }
}
