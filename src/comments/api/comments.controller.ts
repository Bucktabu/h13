import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { QueryInputModel } from '../../users/api/dto/queryInput.model';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Get(':id')
  getCommentById(@Param('id') commentId: string) {
    return this.commentsService.getCommentById(commentId);
  }
}
