import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUserType } from '@_common/types/auth.type';

export const AuthUser = createParamDecorator((_, input: ExecutionContext) => {
    const request = input.switchToHttp().getRequest<{ user: AuthUserType }>();
    return request.user;
});
