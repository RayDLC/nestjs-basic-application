import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProdcutDto } from './dto/create-prodcut.dto';
import { UpdateProdcutDto } from './dto/update-prodcut.dto';
import { Prodcut, ProductImage } from './entities'
import { InjectConnection, InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Equal,  LessThan,  Like,  MoreThan,  Not,  Repository } from 'typeorm';
import  PaginationDto  from '../common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid'
import { User } from '../auth/entities/user.entity';
import { createFilter } from 'src/common/utils/filter.util';

@Injectable()
export class ProdcutsService {

  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Prodcut)
    private readonly productRepo: Repository<Prodcut>,

    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createProdcutDto: CreateProdcutDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProdcutDto;

      const prodcut = this.productRepo.create({
        ...productDetails,
         images: images.map( image => this.productImageRepo.create({ url: image })),
         user: user
      });
      await this.productRepo.save(prodcut);
      return {...prodcut, images};
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(pg: PaginationDto) {
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

      this.handleDBException(error);
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

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected server error, check logs',
    );
  }
}
