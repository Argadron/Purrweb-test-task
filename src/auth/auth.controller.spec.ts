import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/jwt.stragety';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { response } from 'express';
import testPrisma from '../prisma.forTest'
import { UserModule } from '../user/user.module';
import 'dotenv/config'

const prisma = testPrisma()

describe('AuthController', () => {
  let controller: AuthController;
  const testNewUser = {
    email: "hello1@mail.ru",
    password: "12345678"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
      }), UserModule, ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, LocalStrategy, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Test register new user', async () => {
    expect((await controller.register(testNewUser, response)).access).toBeDefined();
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: "hello1@mail.ru"
      }
    })
  })
});
