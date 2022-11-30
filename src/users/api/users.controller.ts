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
import { AuthBasicGuard } from '../../guard/auth.basic.guard';
import { UsersService } from '../application/users.service';
import { QueryInputModel } from './dto/queryInput.model';
import { UserDTO } from './dto/userDTO';
import { UserViewModel } from './dto/userView.model';
import { UserDBModel } from "../infrastructure/entity/userDB.model";

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
  async createUser(@Body() dto: UserDTO): Promise<UserViewModel> {
    const result = await this.usersService.createUser(dto);

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
