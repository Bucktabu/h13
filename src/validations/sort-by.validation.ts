import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";
import { SortParametersModel } from "../global-model/sort-parameters.model";

@Injectable()
export class SortByValidation implements ValidatorConstraintInterface {

  async validate(sortBy) {
    const sortParams = Object.values(SortParametersModel);

    if (!sortBy) {
      sortBy = SortParametersModel.CreatedAt;
    }

    if (!sortParams.includes(sortBy)) {
      sortBy = SortParametersModel.CreatedAt;
    }

    return true
  }
}