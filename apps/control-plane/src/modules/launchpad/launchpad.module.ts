import { Module } from "@nestjs/common";
import { LaunchpadController } from "./launchpad.controller";
import { LaunchpadService } from "./launchpad.service";

@Module({
  providers: [LaunchpadService],
  controllers: [LaunchpadController],
  exports: [LaunchpadService],
})
export class LaunchpadModule {}
