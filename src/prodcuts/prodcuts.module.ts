import { Module } from '@nestjs/common';
import { ProdcutsService } from './prodcuts.service';
import { ProdcutsController } from './prodcuts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prodcut, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProdcutsController],
  providers: [ProdcutsService],
  imports: [
    AuthModule, HttpModule,
    TypeOrmModule.forFeature([Prodcut, ProductImage]),
  ],
  exports: [ProdcutsService],
})
export class ProdcutsModule {}
