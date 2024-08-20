import { Test, TestingModule } from '@nestjs/testing';
import { ColumnService } from './column.service';
import { PrismaService } from '../prisma.service';
import testPrisma from '../prisma.forTest'

const prisma = testPrisma()

describe('ColumnService', () => {
  let service: ColumnService;
  let testId: number;

  beforeAll(async () => {
    const { id } = await prisma.user.create({
      data: { email: "test@mail.ru", password:"1234566" }
    })

    testId = id
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColumnService, PrismaService],
    }).compile();

    service = module.get<ColumnService>(ColumnService);
  });

  it('Test get all coulmns', async () => {
    expect(await service.getAll(testId)).toBeDefined();
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: testId
      }
    })
  })
});
