import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class SearchLoginTermValidation implements ValidatorConstraintInterface {

  async validate(searchLoginTerm) {
    searchLoginTerm = searchLoginTerm.trim()

    if (!searchLoginTerm) {
      searchLoginTerm = '';
    }

    return true
  }
}