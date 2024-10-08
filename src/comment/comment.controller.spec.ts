import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma.service';
import { CardModule } from '../card/card.module';
import testPrisma from '../prisma.forTest'
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const prisma = testPrisma()

describe('CommentController', () => {
  let controller: CommentController;
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [CardModule],
      controllers: [CommentController],
      providers: [CommentService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>()

        request.user = {
          id: 1
        }

        return true
      }
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('Test get all comments', async () => {
    expect((await controller.getAll({ id: testUserId }, testCardId))).toBeDefined();
  });

  it("Test get comment by id", async () => {
    expect((await controller.getById({ id: testUserId }, testCommentId)).createdAt).toBeDefined()
  })

  it("Test create new comment", async () => {
    expect((await controller.create({ id: testUserId }, testNewComment)).authorId).toBeDefined()
  })

  it("Test update comment", async () => {
    expect((await controller.update({ id: testUserId }, testUpdateComment, testCommentId)).updatedAt).toBeDefined()
  })

  it("Test delete comment", async () => {
    expect((await controller.delete({ id: testUserId }, testCommentId))).toBeUndefined()
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
  })
});
