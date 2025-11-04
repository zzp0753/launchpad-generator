import registry from "../registry.json";

type SupportedNetwork = "localhost" | "anvil" | "sepolia";

interface ContractEntry {
  chainId: number;
  address: string;
  abiPath: string;
}

type RegistryShape = Record<string, Partial<Record<SupportedNetwork, ContractEntry>>>;

const registryData = registry as RegistryShape;

export function getContractInfo(name: string, network: SupportedNetwork): ContractEntry {
  const contract = registryData[name];
  if (!contract) {
    throw new Error(`Contract "${name}" not found in registry`);
  }

  const info = contract[network];
  if (!info) {
    throw new Error(`Network "${network}" not configured for contract "${name}"`);
  }

  return info;
}

export function listContracts(): RegistryShape {
  return registryData;
}
