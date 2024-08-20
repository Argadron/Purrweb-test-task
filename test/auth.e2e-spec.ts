import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import testPrisma from '../src/prisma.forTest'

const prisma = testPrisma()

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const testNewUser = {
    email: "hello@mail.ru",
    password: "12345678"
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("/api")

    await app.init();
  });

  it('/api/auth/register (POST) (Test register new user)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testNewUser)
      .expect(201)
  });

  afterAll(() => {
    prisma.user.delete({
      where: {
        email: "hello@mail.ru"
      }
    })
  })
});
