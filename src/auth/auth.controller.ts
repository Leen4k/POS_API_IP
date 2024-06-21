//src/auth/auth.controller.ts

import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('Auth Endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { phone, password }: LoginDto) {
    return this.authService.login(phone, password);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(RolesGuard) // Apply JwtAuthGuard to authenticate and RolesGuard to authorize
  @Roles(Role.Admin, Role.Staff) // Require admin or staff role
  getUserProfile(@Request() req) {
    console.log('Request User:', req.user); // Log the user object to debug
    const userId = req.user?.id; // Extract the user ID from the request object
    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.authService.getUserProfile(userId);
  }
}
