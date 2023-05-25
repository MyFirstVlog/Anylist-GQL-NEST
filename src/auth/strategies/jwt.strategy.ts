import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'), //* To sign 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() //* Validate as Bearer token,
        })
    }

    async validate(payload: any): Promise<User> { //* This must be func name, here the token is already validated

        console.log({payload});

        throw new UnauthorizedException('Usted no puede entrar aqui sapo')
        
    }
}