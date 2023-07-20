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

    // @IsOptional()
    // @Transform( ({value}) => JSON.parse(value || '{}'))
    // filter?: string;

    @IsOptional()
    @Transform(v => v?.value?.split(','))
    key?: string;

    // @IsIn(['adjacent', 'all', 'and', 'any', 'between', 'col', 'contained', 'contains', 'endsWith', 'eq', 'gt', 'gte', 'iLike', 'in', 'iRegexp', 'is', 'like', 'lt', 'lte', 'match', 'ne', 'noExtendLeft', 'noExtendRight', 'not', 'notBetween', 'notILike', 'notIn', 'notIRegexp', 'notLike', 'notRegexp', 'or', 'overlap', 'placeholder', 'regexp', 'startsWith', 'strictLeft', 'strictRight', 'substring', 'values'])
    @IsOptional()
    @Transform(v => v?.value?.split(','))
    operator?: string;

    @IsOptional()
    @Transform(({ value }) => JSON.parse(value ?? '{}'))
    value?: string;
}