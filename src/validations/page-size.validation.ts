import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class PageSizeValidation implements ValidatorConstraintInterface {

  async validate(pageSize) {
    pageSize = Number(pageSize)

    if (!pageSize) {
      pageSize = 10;
    }

    if (isNaN(pageSize)) {
      pageSize = 10;
    }

    if (pageSize < 0) {
      pageSize = 10;
    }

    return true
  }
}