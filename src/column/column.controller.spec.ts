import { Test, TestingModule } from '@nestjs/testing';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { PrismaService } from '../prisma.service';

describe('ColumnController', () => {
  let controller: ColumnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnController],
      providers: [ColumnService, PrismaService],
    }).compile();

    controller = module.get<ColumnController>(ColumnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
