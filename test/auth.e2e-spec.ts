import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import testPrisma from '../src/prisma.forTest'
import 'dotenv/config'
import { ConfigModule } from '@nestjs/config';

const prisma = testPrisma()

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const testNewUser = {
    email: "hello@mail.ru",
    password: "12345678"
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule.forRoot()]
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

  it("/api/auth/login (POST) (Test login user)", () => {
    return request(app.getHttpServer())
    .post("/api/auth/login")
    .send(testNewUser)
    .expect(200)
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: "hello@mail.ru"
      }
    })

    await app.close()
  })
});
