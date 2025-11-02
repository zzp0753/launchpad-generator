import { IsISO8601, IsString, MinLength } from "class-validator";

export class CreateLaunchpadDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  chain!: string;

  @IsISO8601()
  startTime!: string;

  @IsISO8601()
  endTime!: string;
}
