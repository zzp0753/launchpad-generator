import { Module } from "@nestjs/common";
import { LaunchpadModule } from "./modules/launchpad/launchpad.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [PrismaModule, LaunchpadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
