import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";




export const CurrentUser = createParamDecorator((roles = [], context: ExecutionContext) => {

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if(!user) throw new InternalServerErrorException('User was not caught on guards');

    console.log('extracting user in custom decorator', {user});
    
    return user;
})