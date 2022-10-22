import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { AuthUserType } from '../../_common/auth/auth-user.decorator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<AuthUserType> {
    return this.authService.validateEmail(email, password);
  }
}
