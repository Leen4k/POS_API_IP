//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: EmployeeService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { id: string; role: string }) {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      console.log('User not found:', payload.id); // Additional logging
      throw new UnauthorizedException();
    }
    console.log(user);
    return user;
  }
}
