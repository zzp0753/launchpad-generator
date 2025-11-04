import { Controller, Get } from "@nestjs/common";
import { RegistryService } from "./registry.service";

@Controller("api/v1/registry")
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Get()
  getRegistry() {
    return this.registryService.getRegistry();
  }
}
