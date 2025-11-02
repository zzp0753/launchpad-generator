import { Injectable } from "@nestjs/common";
import { Launchpad, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class LaunchpadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LaunchpadCreateInput): Promise<Launchpad> {
    return this.prisma.launchpad.create({ data });
  }

  async findAll(): Promise<Launchpad[]> {
    return this.prisma.launchpad.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Launchpad | null> {
    return this.prisma.launchpad.findUnique({
      where: { id },
    });
  }
}
