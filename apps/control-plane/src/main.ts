import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CORE_LOADED } from "@packages/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  void app.get(PrismaService);

  const corsAllowedOrigins = resolveAllowedOrigins();
  const allowAllOrigins = corsAllowedOrigins.includes("*");

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowAllOrigins || corsAllowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      Logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  Logger.log("core " + CORE_LOADED);
  await app.listen(4000);
}

void bootstrap();

function resolveAllowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS;
  if (!raw) {
    return ["http://localhost:3000"];
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
