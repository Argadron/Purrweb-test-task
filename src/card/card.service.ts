import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
    constructor(private readonly prismaService: PrismaService) {}

    /**
     * This method validate card: Card exsits and card.userid === userid. Or throw errors.
     * @param userId User id
     * @param id Card id
     * @returns card
     */
    private async validateCard(userId: number, id: number) {
        const card = await this.prismaService.card.findUnique({
            where: {
                id
            }
        })

        if (!card) throw new NotFoundException("Card not found")

        if (card.userId !== userId) throw new ForbiddenException("This is not your card")

        return card
    }

    async getAll(userId: number) {
        return await this.prismaService.card.findMany({
            where: {
                userId
            }
        })
    }

    async getById(userId: number, id: number) {
        return await this.validateCard(userId, id)
    }

    async create(userId: number, dto: CreateCardDto) {
        return await this.prismaService.card.create({
            data: {
                userId,
                ...dto
            }
        })
    }

    async update(userId: number, dto: UpdateCardDto, id: number) {
        await this.validateCard(userId, id)

        return await this.prismaService.card.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })
    }

    async delete(userId: number, id: number) {
        await this.validateCard(userId, id)
        await this.prismaService.card.delete({
            where: {
                id
            }
        })

        return undefined
    }
}
