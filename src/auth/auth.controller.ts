import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AuthenticatedRequest } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    // C2 - codigo 201
    @Post('login')
    @HttpCode(201)   
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Req() request: AuthenticatedRequest) {
        return request.user;
    }
}
