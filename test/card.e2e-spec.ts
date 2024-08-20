import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';
import testPrisma from '../src/prisma.forTest'
import { CardStatusEnum } from '@prisma/client';

const prisma = testPrisma()

describe('CardController (e2e)', () => {
  let app: INestApplication;
  let testId: number;
  let testUserId: number;
  let testColumnId: number;
  const testNewCard = {
    header: "testcard",
    description: "supertestcard",
    columnId: 1
  }
  const testUpdateCard = {
    status: CardStatusEnum.COMPLETED
  }

  beforeAll(async () => {
    const { id } = await prisma.user.create({
      data: {
        email: "testik@mail.ru",
        password: "123543543543534"
      }
    })

    const testColumn = await prisma.column.create({
      data: {
        userId: id,
        header: "test"
      }
    })

    testUserId = id 
    testColumnId = testColumn.id

    testNewCard["columnId"] = testColumn.id

    const testCard = await prisma.card.create({
      data: {
        header: "test header",
        description: "test description",
        userId: id,
        columnId: testColumn.id
      }
    })

    testId = testCard.id
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  it('/api/card/all (GET) (Test get all cards)', () => {
    return request(app.getHttpServer())
      .get('/api/card/all')
      .expect(200)
  });

  it("/api/card/id/:id (GET) (Test get card by id)", () => {
    return request(app.getHttpServer())
    .get(`/api/card/${testId}`)
    .expect(200)
  })

  it("/api/card/new (POST) (Test create new card)", () => {
    return request(app.getHttpServer())
    .post("/api/card/new")
    .send(testNewCard)
    .expect(201)
  })

  it("/api/card/update/:id (PUT) (Test update card)", () => {
    return request(app.getHttpServer())
    .put(`/api/card/update/${testId}`)
    .send(testUpdateCard)
    .expect(200)
  })

  it("/api/card/delete/:id (DELETE) (Test delete card)", () => {
    return request(app.getHttpServer())
    .delete(`/api/card/delete/${testId}`)
    .expect(204)
  })

  afterAll(async () => {
    await prisma.card.deleteMany({
        where: {
          header: "testcard"
        }
      })
  
      await prisma.column.delete({
        where: {
          id: testColumnId
        }
      })
  
      await prisma.user.delete({
        where: {
          id: testUserId
        }
      })

    await app.close()
  })
});
