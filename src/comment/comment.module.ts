import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from '../prisma.service';
import { CardModule } from '../card/card.module';

@Module({
  imports: [CardModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
