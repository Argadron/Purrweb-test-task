import { ApiProperty } from "@nestjs/swagger";
import { CardStatusEnum } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCardDto {
    @ApiProperty({
        description: "New card header",
        type: String,
        minLength: 1,
        example: "Task completed",
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    readonly header?: string;

    @ApiProperty({
        description: "New card description",
        type: String,
        minLength: 3,
        example: "Task completed very good",
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    readonly description?: string;

    @ApiProperty({
        description: "Card status",
        enum: CardStatusEnum,
        example: CardStatusEnum.COMPLETED,
        required: false
    })
    readonly status?: CardStatusEnum
}