import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface } from "class-validator";
import { SortDirections } from "../global-model/sort-parameters.model";

@Injectable()
export class SortDirectionsValidation implements ValidatorConstraintInterface {

  async validate(sortDirection) {
    const SortDirect = Object.values(SortDirections);

    if (!sortDirection) {
      sortDirection = SortDirections.Distending;
    }

    if (!SortDirect.includes(sortDirection as SortDirections)) {
      sortDirection = -1;
    }

    if (sortDirection === SortDirections.Ascending) {
      sortDirection = 1;
    } else {
      sortDirection = -1;
    }

    return true
  }
}