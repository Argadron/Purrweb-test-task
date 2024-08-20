import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ColumnModule } from '../src/column/column.module';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import testPrisma from '../src/prisma.forTest'

const prisma = testPrisma()

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testId: number;
  let testColumnId: number;
  const testNewColumn = {
    header: "test"
  }
  const testUpdateColumn = {
    header: "test2"
  }

  beforeAll(async () => {
    const { id } = await prisma.user.create({
      data: { email: "test@mail.ru", password:"1234566" }
    })

    testId = id

    const testColumn = await prisma.column.create({
      data: {
        header: "test",
        userId: id
      }
    })

    testColumnId = testColumn.id
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ColumnModule],
    }).overrideGuard(JwtGuard).useValue({
        canActivate: (ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest<Request>()
  
          request.user = {
            id: 1
          }
  
          return true
        }
      }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("/api")

    await app.init();
  });

  it('/api/column/all (GET) (Get all columns)', () => {
    return request(app.getHttpServer())
      .get('/api/column/all')
      .expect(200)
  });

  it("/api/column/id/:id (GET) (Get column by id)", () => {
    return request(app.getHttpServer())
    .get(`/api/column/id/${testId}`)
    .expect(200)
  })

  it("/api/column/new (POST) (Create new column)", () => {
    return request(app.getHttpServer())
    .post("/api/column/new")
    .send(testNewColumn)
    .expect(201)
  })

  it("/api/column/update/:id (PUT) (Update column)", () => {
    return request(app.getHttpServer())
    .put(`/api/column/update/${testColumnId}`)
    .send(testUpdateColumn)
    .expect(200)
  })

  it("/api/column/delete/:id (DELETE) (Delete column)", () => {
    return request(app.getHttpServer())
    .delete(`/api/column/delete/${testColumnId}`)
    .expect(204)
  })

  afterAll(async () => {
    await prisma.column.deleteMany({
      where: {
        header: "test"
      }
    })

    await prisma.user.delete({
      where: {
        id: testId
      }
    })

    await app.close()
  })
});
