import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const testUserLoginBearer = async (app: INestApplication, userId: number) => {
  const jwtService = app.get(JwtService);

  const accessToken = await jwtService.signAsync({ userId });

  return `Bearer ${accessToken}`;
};
