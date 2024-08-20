import { Test, TestingModule } from '@nestjs/testing';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { PrismaService } from '../prisma.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import testPrisma from '../prisma.forTest'

const prisma = testPrisma()

describe('ColumnController', () => {
  let controller: ColumnController;
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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnController],
      providers: [ColumnService, PrismaService],
    }).overrideGuard(JwtGuard).useValue({
      canActivate: (ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>()

        request.user = {
          id: 1
        }

        return true
      }
    }).compile();

    controller = module.get<ColumnController>(ColumnController);
  });

  it('Test get all columns', async () => {
    expect((await controller.getColumns({ id: testId }))).toBeDefined();
  });

  it("Test get column by id", async () => {
    expect((await controller.getById({ id: testId },testColumnId)).header).toBeDefined()
  })

  it("Test create new column", async () => {
    expect((await controller.create({ id: testId }, testNewColumn)).createdAt).toBeDefined()
  })

  it("Test update column", async () => {
    expect((await controller.update({ id: testId }, testUpdateColumn, testColumnId)).header).toBeDefined()
  })

  it("Test delete column", async () => {
    expect((await controller.delete({ id: testId }, testColumnId))).toBeUndefined()
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
  })
});
