// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization); // Log the request object

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return false; // No token provided or invalid format
    }

    const token = authorizationHeader.split(' ')[1];
    try {
      const decodedToken = this.jwtService.verify(token, { secret: 'zjP9h6ZI5LoSKCRj' }); // Ensure secret is provided
      request.user = { role: decodedToken.role }; // Populate the user object in the request
      return requiredRoles.includes(request.user.role);
    } catch (err) {
      console.error('JWT verification failed:', err); // Log the error for debugging
      return false; // Token verification failed
    }
  }
}
