import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { isEqualToHashed } from "src/global/utils";
import { UsersService } from "src/services/users.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    // async signIn(username: string, pass: string): Promise<any> {
    //     const user = await this.usersService.findOne(username);
    //     const isValidPassword = isEqualToHashed(pass, user.password);

    //     if (!isValidPassword) {
    //         throw new UnauthorizedException();
    //     }

    //     const payload = { userId: user.id, username: user.username };
    //     return {
    //         access_token: await this.jwtService.signAsync(payload),
    //     };
    // }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);

        if (user) {
            const equalToHashed = await isEqualToHashed(pass, user.password);
            if (equalToHashed) {
                const user = await this.usersService.findOne(username);
                return user;
            }
        }
        return null;
    }

    async sign(user: any) {
        user.password = undefined;
        const payload = {
            username: user.username,
            sub: user.id,
            roles: user.roles
        };

        console.log("payload", payload)

        return {
            user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(req: any) {
        const user = await this.validateUser(req.username, req.password);
        console.log("userlogin", user);
        if (!user) {
            throw new HttpException('Invalid username or password!', HttpStatus.BAD_REQUEST);
        } else if (user) {
            return this.sign(user);
        }
    }

}