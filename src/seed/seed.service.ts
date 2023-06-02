import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
    isProd: boolean;

  constructor(
    private readonly configService :ConfigService
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(){

    //? Routes protection
    if(this.isProd) throw new UnauthorizedException('Seeds are not available on prod');
    
    return true;
  }
}
