import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateColumnDto {
    @ApiProperty({
        description: "Column header",
        type: String,
        minLength: 1,
        example: "My column"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly header: string;
}