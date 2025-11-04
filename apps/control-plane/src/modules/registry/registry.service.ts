import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { listContracts } from "@packages/contract-registry";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

type RegistryEntry = {
  chainId: number;
  address: string;
  abiPath: string;
  abi: unknown;
};

type RegistryResponse = Record<string, Record<string, RegistryEntry>>;

@Injectable()
export class RegistryService {
  private readonly registryRootDir = join(dirname(require.resolve("@packages/contract-registry")), "..");

  getRegistry(): RegistryResponse {
    const registry = listContracts();
    const enriched: RegistryResponse = {};

    for (const [contractName, networks] of Object.entries(registry)) {
      if (!networks) {
        continue;
      }

      const networkEntries: Record<string, RegistryEntry> = {};

      for (const [network, entry] of Object.entries(networks)) {
        if (!entry) {
          continue;
        }

        networkEntries[network] = {
          ...entry,
          abi: this.loadAbi(entry.abiPath),
        };
      }

      if (Object.keys(networkEntries).length > 0) {
        enriched[contractName] = networkEntries;
      }
    }

    return enriched;
  }

  private loadAbi(abiPath: string): unknown {
    try {
      const absolutePath = join(this.registryRootDir, abiPath);
      const abiContent = readFileSync(absolutePath, "utf-8");
      return JSON.parse(abiContent);
    } catch (cause) {
      throw new InternalServerErrorException(`Failed to load ABI at path ${abiPath}`, { cause });
    }
  }
}
