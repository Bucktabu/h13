import { Optional } from "@nestjs/common";

export class QueryParametersModel {
  @Optional()
  sortBy: string
}