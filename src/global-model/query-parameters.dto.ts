import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { SortDirections, SortParametersModel } from "./sort-parameters.model";

export class QueryParametersDTO {
  @IsEnum(SortParametersModel)
  @IsOptional()
  sortBy: string = SortParametersModel.CreatedAt

  @IsEnum(SortDirections)
  @IsOptional()
  sortDirection: string = SortDirections.Distending

  @IsNumber()
  @IsOptional()
  pageNumber: number = 1

  @IsNumber()
  @IsOptional()
  pageSize: number = 10

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  searchNameTerm: string = ''

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  searchLoginTerm: string = ''

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  searchEmailTerm: string = ''
}