import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
    constructor(private readonly prismaService: PrismaService) {}

    /**
     * This method check column: Column exsists and userId === column.userId. Throw error if no
     * @param userId - User id 
     * @param id - Column id
     * @returns column
     */
    private async checkColumn(userId: number, id: number) {
        const column = await this.prismaService.column.findUnique({
            where: {
                id
            },
            include: {
                cards: true
            }
        })

        if (!column) throw new NotFoundException("Column not found")

        if (column.userId !== userId) throw new ForbiddenException("This is not your column")

        return column
    }

    async getAll(userId: number) {
        return await this.prismaService.column.findMany({
            where: {
                userId
            }
        })
    }

    async getById(userId: number, id: number) {
        return await this.checkColumn(userId, id)
    }

    async create(userId: number, dto: CreateColumnDto) {
        return await this.prismaService.column.create({
            data: {
                header: dto.header,
                userId
            }
        })
    }

    async update(userId: number, dto: UpdateColumnDto, id: number) {
        await this.checkColumn(userId, id)

        return await this.prismaService.column.update({
            where: {
                id
            },
            data: {
                header: dto.header
            }
        })
    }

    async delete(userId: number, id: number) {
        await this.checkColumn(userId, id)

        await this.prismaService.column.delete({
            where: {
                id
            }
        })

        return undefined
    }
}
