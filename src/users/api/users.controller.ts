import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpException, HttpStatus,
  Param,
  Post,
  Query, Res
} from "@nestjs/common";
import { UsersService } from '../application/users.service';
import { CreateUserInputModel } from "./dto/createUserInput.model";
import { QueryInputModel } from "./dto/queryInput.model";

@Controller('users')
export class UsersController {
  constructor(protected userService: UsersService) {}

  @Get()
  async getUsers(
    @Query()
    query: QueryInputModel
  ) {
    return this.userService.getUsers(query);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() inputModel: CreateUserInputModel) {
    return this.userService.createUser(inputModel);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUsersById(@Param('id') userId: string) {
    const result = await this.userService.deleteUserById(userId);

    if (!result) {
        throw new HttpException('If specified user is not exists', HttpStatus.NOT_FOUND)
    }
  }
}
