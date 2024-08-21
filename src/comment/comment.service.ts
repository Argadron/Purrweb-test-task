import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CardService } from '../card/card.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService,
                private readonly cardService: CardService
    ) {}

    /**
     * This method validate comment: Comment exsists and comment.authorId === userId. Or throw error
     * @param userId Comment author id
     * @param id Comment id
     * @returns comment
     */
    private async validateComment(userId: number, id: number) {
        const comment = await this.prismaService.comment.findUnique({
            where: {
                id
            }
        })

        if (!comment) throw new NotFoundException("Comment not found")

        if (comment.authorId !== userId) throw new ForbiddenException("This is not your comment")

        return comment
    }

    async getAll(userId: number, id: number) {
        return await this.prismaService.comment.findMany({
            where: {
                authorId: userId, 
                cardId: id
            }
        })
    }

    async getById(userId: number, id: number) {
        return await this.validateComment(userId, id)
    }

    async create(userId: number, dto: CreateCommentDto) {
        await this.cardService.getById(userId, dto.cardId)

        return await this.prismaService.comment.create({
            data: {
                authorId: userId,
                ...dto
            }
        })
    }

    async update(userId: number, dto: UpdateCommentDto, id: number) {
        await this.validateComment(userId, id)

        return await this.prismaService.comment.update({
            where: {
                id
            },
            data: {
                text: dto.text
            }
        })
    }

    async delete(userId: number, id: number) {
        await this.validateComment(userId, id)

        await this.prismaService.comment.delete({
            where: {
                id
            }
        })

        return undefined
    }
}
