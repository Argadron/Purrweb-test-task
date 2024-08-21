import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { PrismaService } from '../prisma.service';
import testPrisma from '../prisma.forTest'
import { CardStatusEnum } from '@prisma/client';
import { ColumnModule } from '../column/column.module';

const prisma = testPrisma()

describe('CardService', () => {
  let service: CardService;
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [ColumnModule],
      providers: [CardService, PrismaService],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it('Test get all cards', async () => {
    expect((await service.getAll(testUserId, testColumnId))).toBeDefined();
  });

  it("Test get card by id", async () => {
    expect((await service.getById(testUserId, testId)))
  })

  it("Test create new card", async () => {
    expect((await service.create(testUserId, testNewCard)).userId).toBeDefined()
  })

  it("Test update card", async () => {
    expect((await service.update(testUserId, testUpdateCard, testId)).createdAt).toBeDefined()
  })

  it("Test delete card", async () => {
    expect((await service.delete(testUserId, testId))).toBeUndefined()
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
  })
});
