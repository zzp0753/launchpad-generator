import { apiClient } from "./api-client";
import type { Abi } from "viem";

export interface RegistryContractEntry {
  chainId: number;
  address: string;
  abiPath: string;
  abi: Abi;
}

export type RegistryResponse = Record<string, Record<string, RegistryContractEntry>>;

export async function fetchRegistry(): Promise<RegistryResponse> {
  const response = await apiClient.get<RegistryResponse>("/api/v1/registry");
  return response.data;
}

export function selectSaleFixedForLocalhost(
  registry: RegistryResponse,
): RegistryContractEntry | null {
  const saleFixed = registry["SaleFixed"];

  if (!saleFixed) {
    return null;
  }

  const localhost = saleFixed["localhost"];

  return localhost ?? null;
}
