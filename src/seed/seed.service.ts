import { Injectable } from '@nestjs/common';
import { ProdcutsService } from '../prodcuts/prodcuts.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    public productService: ProdcutsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async executeSeed(){
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProdcuts(adminUser);
    return 'SEED EXECUTED';
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach( user => {
      user.password = bcrypt.hashSync(user.password, 10)
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertNewProdcuts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( async product => {
       insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
