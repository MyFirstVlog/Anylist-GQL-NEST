import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import * as request from 'supertest';


export class JwtAuthGuard extends AuthGuard('jwt') {

    //! Override method, this is the part the changes from rest nest endpoints
    getRequest(context: ExecutionContext){
        console.log('holaaaa')
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req
        return request;
    }


}