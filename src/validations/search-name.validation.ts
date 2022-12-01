import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class SearchNameTermValidation implements ValidatorConstraintInterface {

  async validate(searchNameTerm) {
    searchNameTerm = searchNameTerm.trim()

    if (!searchNameTerm) {
      searchNameTerm = '';
    }

    return true
  }
}