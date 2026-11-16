import { Injectable, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}


  async register(
    data: RegisterDto,
  ): Promise<{ id: string; name: string; email: string; city: string }> {
    // C5 - name y pass no pueden ser iguales
    try {
        if ( data.name.toLowerCase() === data.password.toLowerCase() ) {
            throw new BadRequestException('La contraseña no puede ser igual al nombre.');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create({
        name: data.name,
        email: data.email,
        passwordHash,
        // C1 - campo extra city
        city: data.city,
        });

        return { id: user.id, name: user.name, email: user.email, city: user.city };
    } catch (error) {
        throw error;
    }
    
  }


    // C3 - retornar "name" junto al token
    // C4 - "expires_in" data 
    async login(data: LoginDto): Promise<{ accessToken: string, name: string, expires_in: number }> {
        const user = await this.usersService.findByEmail(data.email);
        const passwordMatches = user
        ? await bcrypt.compare(data.password, user.passwordHash)
        : false;

        if (!process.env.JWT_EXPIRES_IN_SECONDS) {
            throw new Error('JWT_EXPIRES_IN_SECONDS is not defined');
        }
        const env_expires_in = Number(process.env.JWT_EXPIRES_IN_SECONDS);

        if (!user || !passwordMatches) {
        throw new UnauthorizedException('Email o password incorrectos.');
        }

        const payload: JwtPayload = { sub: user.id, email: user.email };

        return { accessToken: await this.jwtService.signAsync(payload), name: user.name, expires_in: env_expires_in };
    }

}
