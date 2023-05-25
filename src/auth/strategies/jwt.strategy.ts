import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from "../../interfaces/jwt-payload.interface";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService,
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'), //* To sign 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() //* Validate as Bearer token,
        })
    }

    async validate(payload: JwtPayload): Promise<User> { //* This must be func name, here the token is already validated

        const {id} = payload;

        const user = await this.authService.validateUser(id);

        return user;
    }
}