import { Controller, Delete, HttpStatus } from "@nestjs/common";
import mongoose from "mongoose";

@Controller('testing')
export class Testing {
  @Delete('all-data')
  async deleteAll() {
      await mongoose.connection.db.dropDatabase()
      return HttpStatus.NO_CONTENT
  }
}