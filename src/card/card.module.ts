import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { PrismaService } from '../prisma.service';
import { ColumnModule } from '../column/column.module';

@Module({
  imports: [ColumnModule],
  controllers: [CardController],
  providers: [CardService, PrismaService],
  exports: [CardService]
})
export class CardModule {}
