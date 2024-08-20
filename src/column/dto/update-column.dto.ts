import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateColumnDto {
    @ApiProperty({
        description: "New column header",
        type: String,
        minLength: 1,
        example: "My new column header"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly header: string;
}