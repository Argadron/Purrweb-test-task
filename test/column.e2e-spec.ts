import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ColumnModule } from '../src/column/column.module';
import { JwtGuard } from '../src/auth/guards/jwt.guard';
import { Request } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ColumnModule],
    }).overrideGuard(JwtGuard).useValue({
        canActivate: (ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest<Request>()
  
          request.user = {
            id: 1
          }
  
          return true
        }
      }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("/api")

    await app.init();
  });

  it('/api/column/all (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/column/all')
      .expect(200)
  });
});
