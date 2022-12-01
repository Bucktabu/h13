import { Validate } from "class-validator";
import { SortByValidation } from "../validations/sort-by.validation";
import { SortDirectionsValidation } from "../validations/sort-directions.validation";
import { PageNumberValidation } from "../validations/page-number.validation";
import { PageSizeValidation } from "../validations/page-size.validation";
import { SearchLoginTermValidation } from "../validations/search-login-term.validation";
import { SearchNameTermValidation } from "../validations/search-name.validation";
import { SearchEmailTermValidation } from "../validations/search-email.term";
import { Transform, TransformFnParams } from "class-transformer";
import { SortDirections, SortParametersModel } from "./sort-parameters.model";

export class QueryParametersDTO {
  //@Validate(SortByValidation)
  @Transform(({ value }: TransformFnParams) => {
    if (!value) {
      value = SortParametersModel.CreatedAt;
    }

    const sortParams = Object.values(SortParametersModel);
    value.trim()

    if (!sortParams.includes(value)) {
      value = SortParametersModel.CreatedAt;
    }
    console.log(value);
    return value
  })
  sortBy: string

  //@Validate(SortDirectionsValidation)
  @Transform(({ value }: TransformFnParams) => {
    const SortDirect = Object.values(SortDirections);

    if (!value) {
      value = SortDirections.Distending;
    }

    if (!SortDirect.includes(value as SortDirections)) {
      value = -1;
    }

    if (value === SortDirections.Ascending) {
      value = 1;
    } else {
      value = -1;
    }

    return value
  })
  sortDirection: number

  //@Validate(PageNumberValidation)
  @Transform(({ value }: TransformFnParams) => {
    if (!value) {
      value = 1;
    }

    value = Number(value)

    if (isNaN(value)) {
      value = 1;
    }

    if (value < 0) {
      value = 1;
    }

    return value
  })
  pageNumber: number

  //@Validate(PageSizeValidation)
  @Transform(({ value }: TransformFnParams) => {
    if (!value) {
      value = 1;
    }

    value = Number(value)

    if (isNaN(value)) {
      value = 10;
    }

    if (value < 0) {
      value = 10;
    }

    return value
  })
  pageSize: number

  //@Validate(SearchNameTermValidation)
  @Transform(({ value }: TransformFnParams) => {
    value = value.trim()

    if (!value) {
      value = '';
    }

    return value
  })
  searchNameTerm: string

  //@Validate(SearchLoginTermValidation)
  @Transform(({ value }: TransformFnParams) => {
    value = value.trim()

    if (!value) {
      value = '';
    }

    return value
  })
  searchLoginTerm: string

  //@Validate(SearchEmailTermValidation)
  @Transform(({ value }: TransformFnParams) => {
    value = value.trim()

    if (!value) {
      value = '';
    }

    return value
  })
  searchEmailTerm: string
}