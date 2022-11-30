import { IsEnum, IsNotEmpty } from "class-validator";
import { ReactionModel } from "./reaction.model";

export class ReactionDTO {
  @IsNotEmpty()
  @IsEnum(ReactionModel)
  likeStatus: ReactionModel
}