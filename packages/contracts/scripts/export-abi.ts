
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const CONTRACT_NAME = "SaleFixed";
const ABI_FILENAME = `${CONTRACT_NAME}.json`;

function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function extractAbi(artifactPath: string) {
  const artifactContent = readFileSync(artifactPath, "utf-8");
  const artifactJson = JSON.parse(artifactContent);

  if (!artifactJson.abi) {
    throw new Error(`ABI not found in artifact at ${artifactPath}`);
  }

  return JSON.stringify(artifactJson.abi, null, 2);
}

async function main() {
  const artifactsDir = resolve(__dirname, "..", "artifacts", "contracts", `${CONTRACT_NAME}.sol`);
  const artifactPath = join(artifactsDir, `${CONTRACT_NAME}.json`);
  const registryAbiDir = resolve(__dirname, "..", "..", "contract-registry", "abi");
  const destinationPath = join(registryAbiDir, ABI_FILENAME);

  ensureDir(dirname(destinationPath));

  if (!existsSync(artifactPath)) {
    throw new Error(`Artifact for ${CONTRACT_NAME} not found. Run hardhat compile first.`);
  }

  const abiJson = extractAbi(artifactPath);
  writeFileSync(destinationPath, abiJson, "utf-8");

  const fullArtifactDest = join(registryAbiDir, `${CONTRACT_NAME}.full.json`);
  copyFileSync(artifactPath, fullArtifactDest);

  console.log(`ABI for ${CONTRACT_NAME} exported to ${destinationPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
