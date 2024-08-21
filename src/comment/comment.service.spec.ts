import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma.service';
import { CardModule } from '../card/card.module';
import testPrisma from '../prisma.forTest'

const prisma = testPrisma()

describe('CommentService', () => {
  let service: CommentService;
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
      data: { email: "commentTestUserService@test.ru", password: "1234567" }
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
      providers: [CommentService, PrismaService],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('Test get all comments', async () => {
    expect((await service.getAll(testUserId, testCardId))).toBeDefined();
  });

  it("Test get comment by id", async () => {
    expect((await service.getById(testUserId, testCommentId)).createdAt).toBeDefined()
  })

  it("Test create new comment", async () => {
    expect((await service.create(testUserId, testNewComment)).authorId).toBeDefined()
  })

  it("Test update comment", async () => {
    expect((await service.update(testUserId, testUpdateComment, testCommentId)).updatedAt).toBeDefined()
  })

  it("Test delete comment", async () => {
    expect((await service.delete(testUserId, testCommentId))).toBeUndefined()
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
