import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot(), AuthModule, ColumnModule, CardModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
