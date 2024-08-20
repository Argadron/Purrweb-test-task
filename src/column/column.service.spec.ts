import { Test, TestingModule } from '@nestjs/testing';
import { ColumnService } from './column.service';
import { PrismaService } from '../prisma.service';
import testPrisma from '../prisma.forTest'

const prisma = testPrisma()

describe('ColumnService', () => {
  let service: ColumnService;
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
      providers: [ColumnService, PrismaService],
    }).compile();

    service = module.get<ColumnService>(ColumnService);
  });

  it('Test get all coulmns', async () => {
    expect(await service.getAll(testId)).toBeDefined();
  });

  it("Test get column by id", async () => {
    expect((await service.getById(testId,testColumnId)).header).toBeDefined()
  })

  it("Test create new column", async () => {
    expect((await service.create(testId, testNewColumn)).createdAt).toBeDefined()
  })

  it("Test update column", async () => {
    expect((await service.update(testId, testUpdateColumn, testColumnId)).header).toBeDefined()
  })

  it("Test delete column", async () => {
    expect((await service.delete(testId, testId))).toBeUndefined()
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
