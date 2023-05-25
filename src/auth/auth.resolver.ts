import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/types/auth-response.type';
import { LoginInput, SignupInput } from './dto/input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {name: 'signup'})
  signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput); 
  }

  @Mutation(() => AuthResponse, {name: 'login'})
  login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput); 
  }

  @Query(() => AuthResponse, {name: 'revalidate'})
  @UseGuards(JwtAuthGuard) //* Solo se guarda la referencia
  revalidateToken(
    //@currentUser
  ): Promise<AuthResponse> {
    // return this.authService.revalidate(); 

    throw new Error('Not implemented yet')
  }

}
