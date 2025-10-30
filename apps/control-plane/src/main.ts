import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CORE_LOADED } from "@packages/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Logger.log("core " + CORE_LOADED);
  await app.listen(4000);
}

void bootstrap();
