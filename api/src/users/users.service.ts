import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOneBy({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, password: hashedPassword });
    const saved = await this.usersRepository.save(user);

    return this.usersRepository.findOneByOrFail({ id: saved.id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}