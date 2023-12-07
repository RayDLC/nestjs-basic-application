import { Controller, Get, Post, Body, UseGuards, Headers, Patch } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, Auth } from './decorators';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './guards/no-jwt.guard';
 
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @Public()
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('renew-token')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.authService.checkAuthStatus(user);
  }

  @Patch('reset-password')
  @Auth()
  resetPassword(
    @GetUser() user: User,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(user, password);
  }
}
