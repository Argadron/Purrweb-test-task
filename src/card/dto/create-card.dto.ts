import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateCardDto {
    @ApiProperty({
        description: "Card header",
        type: String,
        minLength: 1,
        example: "Complete Purrweb test task"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly header: string; 

    @ApiProperty({
        description: "Card description",
        type: String,
        minLength: 3,
        example: "Complete backend Purrweb test task"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly description: string;

    @ApiProperty({
        description: "Column id", 
        type: Number,
        minimum: 1,
        example: 1
    })
    @IsNumber()
    @Min(1)
    readonly columnId: number;
}