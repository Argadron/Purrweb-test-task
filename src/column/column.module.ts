import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService, PrismaService],
})
export class ColumnModule {}
