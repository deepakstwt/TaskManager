import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (configService.get('JWT_SECRET') || 'super-secret-key-fallback') as string,
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.userId, 
      projectId: payload.projectId,
      inviteCode: payload.inviteCode,
      name: payload.name,
      role: payload.role 
    };
  }
}
