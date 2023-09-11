import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export default class PaginationDto {

    @ApiProperty({
        default: 10, description: 'Limit of items per page'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit? : number;

    @ApiProperty({
        default: 1, description: 'How many items do you want to skip'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page? : number;

    @IsOptional()
    // @Transform(({ value }) => value?.split(',') ?? value)
    key?: string;

    @IsOptional()
    // @Transform(({ value }) => value?.split(',') ?? value)
    operator?: string;

    @IsOptional()
    // @Transform(({ value }) => JSON.parse(value ?? '{}'))
    value?: string;

}
