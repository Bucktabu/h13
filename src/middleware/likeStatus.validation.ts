import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ReactionModel } from '../globalTypes/reaction.model';

@Injectable()
export class LikeStatusValidation implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const likeStatusModel = Object.values(ReactionModel);

    if (!likeStatusModel.includes(req.body.likeStatus as ReactionModel)) {
      throw new Error('Incorrect input data');
    }

    next();
  }
}
