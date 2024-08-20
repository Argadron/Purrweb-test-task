import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ColumnService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAll(userId: number) {
        return await this.prismaService.column.findMany({
            where: {
                userId
            }
        })
    }
}
