import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello roth';
  };

  getWelcome(): number {
    return 2;
  }
}
