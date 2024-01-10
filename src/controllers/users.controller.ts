import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ROLES } from 'src/auth/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decarator';
import { Users } from 'src/entities/users.entity';
import { UsersService } from 'src/services/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles(ROLES.admin)
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<Users[]> {
        return await this.usersService.findAll();
    }

    @Post('save')
    async save(@Body() dto: any): Promise<Users> {
        return await this.usersService.save(dto);
    }
}