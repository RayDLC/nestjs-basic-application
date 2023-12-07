import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProdcutsService } from './prodcuts.service';
import { CreateProdcutDto } from './dto/create-prodcut.dto';
import { UpdateProdcutDto } from './dto/update-prodcut.dto';
import  PaginationDto from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prodcut } from './entities';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('prodcuts')
export class ProdcutsController {
  constructor(
    private readonly prodcutsService: ProdcutsService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Product was created', type: Prodcut })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  postProduct(
    @Body() createProdcutDto: CreateProdcutDto,
    @GetUser() user: User 
  ) {
    return this.prodcutsService.postProduct(createProdcutDto, user);
  }

  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.prodcutsService.getProducts(paginationDto);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProdcutDto: UpdateProdcutDto,
    @GetUser() user: User 
  ) {
    return this.prodcutsService.update(id, updateProdcutDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prodcutsService.remove(id);
  }

}
