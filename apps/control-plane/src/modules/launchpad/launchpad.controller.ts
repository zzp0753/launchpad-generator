import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
} from "@nestjs/common";
import { Launchpad } from "@prisma/client";
import { CreateLaunchpadDto } from "./launchpad.dto";
import { LaunchpadService } from "./launchpad.service";

@Controller("api/v1/launchpads")
export class LaunchpadController {
  constructor(private readonly launchpadService: LaunchpadService) {}

  @Post()
  async create(@Body() body: CreateLaunchpadDto): Promise<Launchpad> {
    const startTime = this.parseIsoDate(body.startTime, "startTime");
    const endTime = this.parseIsoDate(body.endTime, "endTime");

    return this.launchpadService.create({
      name: body.name,
      chain: body.chain,
      startTime,
      endTime,
    });
  }

  @Get()
  findAll(): Promise<Launchpad[]> {
    return this.launchpadService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Launchpad> {
    const launchpad = await this.launchpadService.findById(id);

    if (!launchpad) {
      throw new NotFoundException("Launchpad not found");
    }

    return launchpad;
  }

  private parseIsoDate(value: string, field: string): Date {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`${field} must be a valid ISO date string`);
    }
    return parsed;
  }
}
