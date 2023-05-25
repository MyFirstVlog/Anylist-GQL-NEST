import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthResponse } from './dto/types/auth-response.type';
import { SignupInput } from './dto/input/signup.input';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/input/login.input';
import * as bcrypt from 'bcrypt'; 
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    private getJwt(userId: string){
        return this.jwtService.sign({
            id: userId
        });
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse>{

        const user = await this.usersService.create(signupInput);

        return {
            user,
            token: this.getJwt(user.id)
        }
    }

    async login(loginInput :LoginInput): Promise<AuthResponse>{

        const user = await this.usersService.findOneByEmail(loginInput);

        console.log({user});

        if(!bcrypt.compareSync(loginInput.password, user.password)){
            throw new BadRequestException(`Credentials incorrect`);
        };
        
        return {
            user,
            token: this.getJwt(user.id)
        }
    }
}
