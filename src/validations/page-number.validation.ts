import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class PageNumberValidation implements ValidatorConstraintInterface {

  async validate(pageNumber) {
    pageNumber = Number(pageNumber)

    if (!pageNumber) {
      pageNumber = 1;
    }

    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }

    if (pageNumber < 0) {
      pageNumber = 1;
    }

    return true
  }
}