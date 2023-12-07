import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProdcutDto {

    // @Transform(({ value }) => value.toUpperCase())
    @ApiProperty()
    @IsString()
    @MinLength(1)
    title?: string = '';

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number = 0;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string = '';

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string = '';

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number = 0;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty()
    @IsIn(['men', 'woman', 'kids', 'unisex'])
    @IsString()
    gender: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[] = [];
}
