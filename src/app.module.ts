import { join } from 'path';

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { ProdcutsModule } from './prodcuts/prodcuts.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      // synchronize: true,
      logging: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    SeedModule,
    ProdcutsModule,
    FilesModule,
    MessagesWsModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule { }
