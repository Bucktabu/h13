import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers() {
    return this.appService.getHello();
  }
}
