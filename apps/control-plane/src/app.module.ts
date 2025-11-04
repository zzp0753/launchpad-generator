import { Module } from "@nestjs/common";
import { LaunchpadModule } from "./modules/launchpad/launchpad.module";
import { RegistryModule } from "./modules/registry/registry.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [PrismaModule, LaunchpadModule, RegistryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
