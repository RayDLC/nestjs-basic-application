import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProdcutDto } from './dto/create-prodcut.dto';
import { UpdateProdcutDto } from './dto/update-prodcut.dto';
import { Prodcut, ProductImage } from './entities'
import { InjectConnection, InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Equal,  LessThan,  Like,  MoreThan,  Not,  Repository } from 'typeorm';
import  PaginationDto  from '../common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid'
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProdcutsService {

  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Prodcut)
    private readonly prodcutRepository: Repository<Prodcut>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createProdcutDto: CreateProdcutDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProdcutDto;

      const prodcut = this.prodcutRepository.create({
        ...productDetails,
         images: images.map( image => this.productImageRepository.create({ url: image })),
         user: user
      });
      await this.prodcutRepository.save(prodcut);
      return {...prodcut, images};
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(pg: PaginationDto) {
    // console.log(JSON.parse('{"price":LessThan(40),"stock":LessThan(3)}'))
    console.log(JSON.stringify(pg))

    //* {"stock":{"_type":"equal","_value":"0","_useParameter":true,"_multipleParameters":false}}
    let where = {
      [pg.key]: (pg.operator == 'eq') && Equal(pg.value)
      || (pg.operator == 'more') && MoreThan(pg.value)
      || (pg.operator == 'less') && LessThan(pg.value)
      // || (pg.operator == 'bet') && Between(pg.value.split(''))
      || (pg.operator == 'not') && Not(pg.value)
      || (pg.operator == 'like') && Like(pg.value)
    }

    !pg.operator && (where = {})

    const { limit = 10, page = 1} = pg;
    const total = await this.prodcutRepository.count({ where });
    const prods =  await this.prodcutRepository.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        images: true
      },
    });

    //* Another way to do it
    // return prods.map( { images, ...detalle } => ({
    //   ...detalle,
    //   images: images.map( image => image.url )
    // }))

    return {
      rows: prods.map( product => ({
        ...product,
        images: product.images.map( image => image.url )
      })),
      total
    }
  }

  async findOne(term: string) {

    let prodcut: Prodcut;

    if(isUUID(term)){
      prodcut = await this.prodcutRepository.findOneBy({ id: term });
    } else {
      // prodcut = await this.prodcutRepository.findOneBy({ slug: term });
      const query = this.prodcutRepository.createQueryBuilder('prod');
      prodcut = await query.where(`UPPER(title) = :title or slug = :slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }

    if(!prodcut) throw new NotFoundException(`Product with value ${term} not found`);
    
    return prodcut;
  }

  async findOnePlain(term: string) {
    const {images = [], ...rest} = await this.findOne(term);
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update(id: string, updateProdcutDto: UpdateProdcutDto, user: User) {

    const { images, ...toUpdate } = updateProdcutDto;

    const product = await this.prodcutRepository.preload({ id, ...toUpdate})

    if(!product) throw new NotFoundException(`Product with id ${id} not found`);

    //* Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if(images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map( 
          image => this.productImageRepository.create({ url: image }) )
      }
      // else {
      //   product.images = await this.productImageRepository.findBy()
      // }
      // await this.prodcutRepository.save(product);
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBException(error);
    }

    return product;
  }

  async remove(id: string) {

    const prodcut = await this.findOne(id);    
    await this.prodcutRepository.remove(prodcut);
    return `Product with the id #${id} deleted`;
  }

  async deleteAllProducts() {
    const query = this.prodcutRepository.createQueryBuilder('prod');

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
