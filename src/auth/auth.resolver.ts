import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/input/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {name: 'signup'})
  signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput); 
  }

  // @Mutation(/** */, {name: 'login'})
  // login(): Promise</** */> {
  //   // return this.authService.login(); 
  // }

  // @Mutation(/** */, {name: 'revalidate'})
  // revalidateToken(): Promise</** */> {
  //   // return this.authService.revalidate(); 
  // }

}
