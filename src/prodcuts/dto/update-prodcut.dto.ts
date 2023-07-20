import { PartialType } from '@nestjs/swagger';
import { CreateProdcutDto } from './create-prodcut.dto';

export class UpdateProdcutDto extends PartialType(CreateProdcutDto) {}
