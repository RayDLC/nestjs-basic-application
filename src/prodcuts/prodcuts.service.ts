import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProdcutDto } from './dto/create-prodcut.dto';
import { UpdateProdcutDto } from './dto/update-prodcut.dto';
import { Prodcut, ProductImage } from './entities'
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import  PaginationDto  from '../common/dtos/pagination.dto';

import { User } from '../auth/entities/user.entity';
import { createFilter } from 'src/common/utils/filter.util';
import { Client } from 'basic-ftp';


@Injectable()
export class ProdcutsService {

  private readonly logger = new Logger('ProductsService');
  constructor(

    @InjectRepository(Prodcut)
    private readonly productRepo: Repository<Prodcut>,

    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,

    private readonly dataSource: DataSource,
   
  ) {
  }

  async postProduct(createProdcutDto: CreateProdcutDto, user: User) {
    const { images = [], ...productDetails } = createProdcutDto;
    return this.productRepo.create({
      ...productDetails,
       images: images.map( image => this.productImageRepo.create({ url: image })),
       user: user
    });
  }

  async getProducts(pg: PaginationDto) {
    const { limit = 10, page = 1} = pg;    
    const where = createFilter(pg);    
    const total = await this.productRepo.count({ where });    
    const rows =  await this.productRepo.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        images: true
      },
    });
    return { rows, total }
  }

  async update(id: string, updateProdcutDto: UpdateProdcutDto, user: User) {

    const { images, ...toUpdate } = updateProdcutDto;
    const product = await this.productRepo.preload({ id, ...toUpdate})
    if(!product) throw new NotFoundException(`Product with id ${id} not found`);

    //* Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if(images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map( 
          image => this.productImageRepo.create({ url: image }) )
      }
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.productRepo.findOneBy({ id });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
    return product;
  }

  async remove(id: string) {
    const prodcut = await this.productRepo.findOne({ where: { id } });    
    await this.productRepo.remove(prodcut);
    return `Product with the id #${id} deleted`;
  }

  async deleteAllProducts() {
    const query = this.productRepo.createQueryBuilder('prod');
    return await query.delete().where({}).execute();
  }

}
