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

  beforeAll(async () => {
    const { id } = await prisma.user.create({
      data: { email: "test@mail.ru", password:"1234566" }
    })

    testId = id
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

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: testId
      }
    })
  })
});
