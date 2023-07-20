import { Module } from '@nestjs/common';
import { ProdcutsService } from './prodcuts.service';
import { ProdcutsController } from './prodcuts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prodcut, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';
import { EncryptionInterceptor } from 'src/common/interceptors/encrypt.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [ProdcutsController],
  providers: [ProdcutsService ],
  imports: [TypeOrmModule.forFeature([Prodcut, ProductImage]), AuthModule],
  exports: [ProdcutsService],
})
export class ProdcutsModule {}
