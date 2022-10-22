import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUserType = { userId: number };

export const AuthUser = createParamDecorator((_, input: ExecutionContext): Promise<AuthUserType> => {
  return input.switchToHttp().getRequest().user;
});
