import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealth() {
    return { status: "ok" };
  }
}
