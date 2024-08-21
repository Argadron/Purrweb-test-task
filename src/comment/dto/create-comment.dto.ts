import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        description: "Comment text",
        type: String,
        minLength: 1,
        example: "I complete this today"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly text: string;

    @ApiProperty({
        description: "Card id",
        type: Number, 
        minimum: 1,
        example: 1
    })
    @IsNumber()
    @Min(1)
    readonly cardId: number;
}