import { ApiProperty } from "@nestjs/swagger";
import { CardStatusEnum } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

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
    @Expose()
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
    @Expose()
    readonly description?: string;

    @ApiProperty({
        description: "Card status",
        enum: CardStatusEnum,
        example: CardStatusEnum.COMPLETED,
        required: false
    })
    @IsEnum(CardStatusEnum)
    @IsNotEmpty()
    @IsOptional()
    @Expose()
    readonly status?: CardStatusEnum
}