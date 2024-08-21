import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommentModule } from '../src/comment/comment.module';
import testPrisma from '../src/prisma.forTest'
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';

const prisma = testPrisma()

describe('CommentController (e2e)', () => {
  let app: INestApplication;
  let testUserId: number;
  let testColumnId: number; 
  let testCardId: number;
  let testCommentId: number; 
  const testNewComment = {
    text: "mytext",
    cardId: 1
  }
  const testUpdateComment = {
    text: "mynewtext"
  }

  beforeAll(async () => {
    const { id } = await prisma.user.create({
      data: { email: "commentTestUserController@test.ru", password: "1234567" }
    })

    testUserId = id 

    const testColumn = await prisma.column.create({
      data: {
        userId: id,
        header: "testColumn"
      }
    })

    testColumnId = testColumn.id 

    const testCard = await prisma.card.create({
      data: {
        columnId: testColumn.id,
        header: "testcard",
        description: "testcarddd",
        userId: id
      }
    })

    testCardId = testCard.id 
    testNewComment["cardId"] = testCard.id

    const testComment = await prisma.comment.create({
      data: {
        text: "testcomment",
        authorId: id,
        cardId: testCard.id
      }
    })

    testCommentId = testComment.id
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommentModule],
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

  it('/api/comment/all (GET) (Test get all comments)', () => {
    return request(app.getHttpServer())
      .get('/api/comment/all')
      .expect(200)
  });

  it("/api/comment/id/:id (GET) (Test get comment by id)", () => {
    return request(app.getHttpServer())
    .get(`/api/comment/${testCommentId}`)
    .expect(200)
  })

  it("/api/comment/new (POST) (Test create new comment)", () => {
    return request(app.getHttpServer())
    .post("/api/comment/new")
    .send(testNewComment)
    .expect(201)
  })

  it("/api/comment/update/:id (PUT) (Test update comment)", () => {
    return request(app.getHttpServer())
    .put(`/api/comment/update/${testCommentId}`)
    .send(testUpdateComment)
    .expect(200)
  })

  it("/api/comment/delete/:id (DELETE) (Test delete comment)", () => {
    return request(app.getHttpServer())
    .delete(`/api/comment/delete/${testCommentId}`)
    .expect(204)
  })

  afterAll(async () => {
    await prisma.comment.deleteMany({
      where: {
        text: "mytext"
      }
    })

    await prisma.card.delete({
      where: {
        id: testCardId
      }
    })

    await prisma.column.delete({
      where: {
        id: testCardId
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
