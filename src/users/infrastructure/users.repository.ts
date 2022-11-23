import { Injectable } from '@nestjs/common';
import { giveSkipNumber } from '../../helper.functions';
import { UserScheme } from './entity/users.scheme';
import { UserDBModel } from './entity/userDB.model';
import { QueryInputModel } from '../api/dto/queryInput.model';
import { UserViewModel } from '../api/dto/userView.model';

@Injectable()
export class UsersRepository {
  async getUsers(query: QueryInputModel): Promise<UserViewModel[]> {
    console.log(query.searchLoginTerm, query.searchEmailTerm);

    return UserScheme.find(
      {
        $and: [
          { login: { $regex: query.searchLoginTerm, $options: 'i' } },
          { email: { $regex: query.searchEmailTerm, $options: 'i' } },
        ],
      },
      { _id: false, passwordHash: false, passwordSalt: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(Number(query.pageSize))
      .lean();
  }

  async getTotalCount(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number> {
    return UserScheme.countDocuments({
      $and: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });
  }

  async createUser(newUser: UserDBModel): Promise<UserDBModel | null> {
    try {
      await UserScheme.create(newUser);
      return newUser;
    } catch (e) {
      return null;
    }
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await UserScheme.deleteOne({ id: userId });
    return result.deletedCount === 1;
  }
}
