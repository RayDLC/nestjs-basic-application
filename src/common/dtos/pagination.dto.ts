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
    key?: string;

    @IsOptional()
    operator?: string;

    @IsOptional()
    value?: string | number;

    // @IsOptional()
    // // @Transform( ({value}) => JSON.parse(value || '{}'))
    // filter?: Filter;
}

// export class Filter {
//     key: string;
//     value: string | number;
// }