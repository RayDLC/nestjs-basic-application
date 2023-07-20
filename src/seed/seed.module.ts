import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProdcutsModule } from '../prodcuts/prodcuts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProdcutsModule, AuthModule],
})
export class SeedModule {}
