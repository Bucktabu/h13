import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserInputModel } from './dto/createUserInput.model';
import { QueryInputModel } from './dto/queryInput.model';
import { UserViewModel } from './dto/userView.model';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  getUsers(
    @Query()
    query: QueryInputModel,
  ) {
    return this.usersService.getUsers(query);
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() inputModel: CreateUserInputModel): Promise<UserViewModel> {
    return this.usersService.createUser(inputModel);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUsersById(@Param('id') userId: string) {
    const result = await this.usersService.deleteUserById(userId);

    if (!result) {
      throw new NotFoundException();
    }

    return
  }
}