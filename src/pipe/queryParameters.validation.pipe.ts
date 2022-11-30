import { Injectable, PipeTransform, ValidationPipe } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { SortDirection, SortParameters } from "../globalTypes/sort.parameters";

@Injectable()
export class QueryParametersValidationPipe extends ValidationPipe {
  use(req: Request, res: Response, next: NextFunction) {
    const sortParameters = Object.values(SortParameters);
    const sortBy = req.query.sortBy;

    if (!sortBy) {
      req.query.sortBy = SortParameters.CreatedAt;
    }

    if (!sortParameters.includes(sortBy as SortParameters)) {
      req.query.sortBy = SortParameters.CreatedAt;
    }

    const sortDirections = Object.values(SortDirection);
    const sortDirection = req.query.sortDirection;

    if (!sortDirection) {
      req.query.sortDirection = SortDirection.Distending;
    }

    if (!sortDirections.includes(sortDirection as SortDirection)) {
      req.query.sortDirection = SortDirection.Distending;
    }

    const pageNumber = req.query.pageNumber;

    if (!pageNumber) {
      req.query.pageNumber = '1';
    }

    if (isNaN(Number(pageNumber))) {
      req.query.pageNumber = '1';
    }

    if (Number(pageNumber) < 0) {
      req.query.pageNumber = '1';
    }

    const pageSize = req.query.pageSize;

    if (!pageSize) {
      req.query.pageSize = '10';
    }

    if (isNaN(Number(pageSize))) {
      req.query.pageSize = '10';
    }

    if (Number(pageSize) < 0) {
      req.query.pageSize = '10';
    }

    if (!req.query.searchNameTerm) {
      req.query.searchNameTerm = '';
    }

    req.query.searchNameTerm = (req.query.searchNameTerm as string).trim();

    if (!req.query.searchLoginTerm) {
      req.query.searchLoginTerm = '';
    }

    req.query.searchLoginTerm = (req.query.searchLoginTerm as string).trim();

    if (!req.query.searchEmailTerm) {
      req.query.searchEmailTerm = '';
    }

    req.query.searchEmailTerm = (req.query.searchEmailTerm as string).trim();

    next();
  }
}