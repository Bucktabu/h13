import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class SearchEmailTermValidation implements ValidatorConstraintInterface {

  async validate(searchEmailTerm) {
    searchEmailTerm = searchEmailTerm.trim()

    if (!searchEmailTerm) {
      searchEmailTerm = '';
    }

    return true
  }
}