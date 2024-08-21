import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateCommentDto {
    @ApiProperty({
        description: "New comment text",
        type: String,
        minLength: 1,
        example: "I not complete this today"
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    readonly text: string;
}