import { Injectable } from '@nestjs/common';
import { AuthResponse } from './dto/types/auth-response.type';
import { SignupInput } from './dto/input/signup.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService
    ){}

    async signup(signupInput: SignupInput): Promise<AuthResponse>{

        const user = await this.usersService.create(signupInput);

        const token = "ABC123";

        return {
            user,
            token
        }
    }
}
