import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

type CreateUserInputModel = {
  login: string;
  password: string;
  email: string;
};

@Controller('users')
export class UsersController {
  constructor(protected userService: UsersService) {}

  @Get()
  getUsers(
    @Query()
    query: {
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
      searchLoginTerm: string;
      searchEmailTerm: string;
    },
  ) {
    return this.appService.getHello();
  }

  @Get(':id')
  getUsersById(@Param('id') userId: string) {
    return this.appService.getHello();
  }

  @Post()
  createUser(@Body() inputModel: CreateUserInputModel) {
    return this.appService.getHello();
  }
}
