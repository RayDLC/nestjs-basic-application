import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
            
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login( loginUserDto: LoginUserDto ) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if(!user) throw new UnauthorizedException('Invalid credentials (email)');
    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Invalid credentials (password)');

    return this.getJwtToken({ id: user.id, email })
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async resetPassword(user: User, password: string) {
    try {      
      const userToUpdate = await this.userRepository.findOne({
        where: { id: user.id }
      });
      userToUpdate.password = bcrypt.hashSync(password, 10);
      await this.userRepository.save(userToUpdate);
      return user
    } catch (error) {      
      this.handleDBError(error);
    }
  }

  private getJwtToken = (payload: JwtPayload): string => this.jwtService.sign(payload);

  private handleDBError(error: any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }

}
