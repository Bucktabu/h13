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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserInputModel } from './dto/userInputModel';
import { QueryInputModel } from './dto/queryInput.model';
import { UserViewModel } from './dto/userView.model';
import { AuthBasicGuard } from '../../guard/auth.basic.guard';

@Controller('users')
@UseGuards(AuthBasicGuard)
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
  async createUser(@Body() inputModel: UserInputModel): Promise<UserViewModel> {
    const result = await this.usersService.createUser(inputModel);

    return result.user;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUsersById(@Param('id') userId: string) {
    const result = await this.usersService.deleteUserById(userId);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }
}
