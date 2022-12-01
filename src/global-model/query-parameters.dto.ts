import { IsEnum, IsOptional, Validate } from "class-validator";
import { SortByValidation } from "../validations/sort-by.validation";
import { SortDirectionsValidation } from "../validations/sort-directions.validation";
import { PageNumberValidation } from "../validations/page-number.validation";
import { PageSizeValidation } from "../validations/page-size.validation";
import { SearchLoginTermValidation } from "../validations/search-login-term.validation";
import { SearchNameTermValidation } from "../validations/search-name.validation";
import { SearchEmailTermValidation } from "../validations/search-email.term";
import { SortParametersModel } from "./sort-parameters.model";

export class QueryParametersDTO {
  @Validate(SortByValidation)
  @IsEnum(SortParametersModel)
  @IsOptional()
  sortBy: string = SortParametersModel.CreatedAt

  @Validate(SortDirectionsValidation)
  sortDirection: number

  @Validate(PageNumberValidation)
  pageNumber: number

  @Validate(PageSizeValidation)
  pageSize: number

  @Validate(SearchNameTermValidation)
  searchNameTerm: string

  @Validate(SearchLoginTermValidation)
  searchLoginTerm: string

  @Validate(SearchEmailTermValidation)
  searchEmailTerm: string
}