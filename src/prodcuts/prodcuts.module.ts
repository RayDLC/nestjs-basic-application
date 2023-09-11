import { Module } from '@nestjs/common';
import { ProdcutsService } from './prodcuts.service';
import { ProdcutsController } from './prodcuts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prodcut, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  controllers: [ProdcutsController],
  providers: [ProdcutsService],
  imports: [
    TypeOrmModule.forFeature([Prodcut, ProductImage]), AuthModule,
    CacheModule.registerAsync({
      useFactory: () => ({
        isGlobal: true,
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        ttl: 60,
      }),
    }),
  ],
  exports: [ProdcutsService],
})
export class ProdcutsModule {}
