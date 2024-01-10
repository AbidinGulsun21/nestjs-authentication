import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { getHashed } from 'src/global/utils';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    async findAll(): Promise<Users[]> {
        return await this.usersRepository.find();
    }

    findOne(username: string): Promise<Users | null> {
        return this.usersRepository.findOneBy({ username });
    }

    async save(dto: any): Promise<Users | null> {
        console.log("dto", dto);
        dto.password = await getHashed(dto.password);
        return await this.usersRepository.save(dto);
    }


    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
