import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/jwt.stragety';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    global: true
  }), UserModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, ConfigService],
})
export class AuthModule {}
