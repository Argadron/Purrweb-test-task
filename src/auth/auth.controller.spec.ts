import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/jwt.stragety';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';
import testPrisma from '../prisma.forTest'
import { UserModule } from '../user/user.module';

const prisma = testPrisma()

describe('AuthController', () => {
  let controller: AuthController;
  const testNewUser = {
    email: "hello@mail.ru",
    password: "12345678"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "123"
      }), UserModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, LocalStrategy, ConfigService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Test register new user', async () => {
    expect((await controller.register(testNewUser, response)).access).toBeDefined();
  });

  afterAll(() => {
    prisma.user.delete({
      where: {
        email: "hello@mail.ru"
      }
    })
  })
});
