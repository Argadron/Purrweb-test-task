import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { PrismaService } from '../prisma.service';
import { ColumnModule } from '../column/column.module';
import testPrisma from '../prisma.forTest'
import { ExecutionContext } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { CardStatusEnum } from '@prisma/client';

const prisma = testPrisma()

describe('CardController', () => {
  let controller: CardController;
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
        email: "testik2@mail.ru",
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
      controllers: [CardController],
      providers: [CardService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>()

        request.user = {
          id: 1
        }

        return true
      }
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('Test get all cards', async () => {
    expect((await controller.getAll({ id: testUserId }))).toBeDefined();
  });

  it("Test get card by id", async () => {
    expect((await controller.getById({ id: testUserId }, testId)))
  })

  it("Test create new card", async () => {
    expect((await controller.create({ id: testUserId }, testNewCard)).userId).toBeDefined()
  })

  it("Test update card", async () => {
    expect((await controller.update({ id: testUserId }, testUpdateCard, testId)).createdAt).toBeDefined()
  })

  it("Test delete card", async () => {
    expect((await controller.delete({ id: testUserId }, testId))).toBeUndefined()
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
