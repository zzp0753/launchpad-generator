'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Address, Chain } from "viem";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { Button } from "@packages/ui";
import {
  fetchRegistry,
  RegistryContractEntry,
  selectSaleFixedForLocalhost,
} from "@/lib/registry";

type LoadState = "idle" | "loading" | "success" | "error";

const DEFAULT_RPC_URL =
  process.env.NEXT_PUBLIC_LOCAL_RPC_URL ?? "http://127.0.0.1:8545";

interface ContractReadResult {
  address: Address;
  owner: Address;
  saleName: string;
  chainId: number;
}

export default function OnchainCheckPage() {
  const [state, setState] = useState<LoadState>("idle");
  const [result, setResult] = useState<ContractReadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRegistryAndRead = useCallback(async () => {
    setState("loading");
    setErrorMessage(null);

    try {
      const registry = await fetchRegistry();
      const saleFixed = selectSaleFixedForLocalhost(registry);

      if (!saleFixed) {
        throw new Error(
          "未在 registry 中找到本地链的 SaleFixed 合约地址，请先运行部署脚本并导出 ABI。",
        );
      }

      const contract = normalizeContractEntry(saleFixed);
      const client = createPublicClient({
        chain: contract.chain,
        transport: http(contract.rpcUrl),
      });

      const [owner, saleName] = await Promise.all([
        client.readContract({
          address: contract.address,
          abi: contract.abi,
          functionName: "owner",
        }),
        client.readContract({
          address: contract.address,
          abi: contract.abi,
          functionName: "saleName",
        }),
      ]);

      setResult({
        address: contract.address,
        owner: owner as Address,
        saleName: saleName as string,
        chainId: contract.chainId,
      });
      setState("success");
    } catch (error) {
      console.error("Failed to read SaleFixed contract", error);
      setResult(null);
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "未知错误，请检查控制台日志。",
      );
    }
  }, []);

  useEffect(() => {
    loadRegistryAndRead();
  }, [loadRegistryAndRead]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-slate-500">
            On-chain Diagnostics
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            SaleFixed 只读检查
          </h1>
          <p className="text-base text-slate-600">
            该页面从后端 registry 读取合约信息，并通过 viem 调用{" "}
            <code className="rounded bg-slate-200 px-1 text-sm">owner()</code>{" "}
            与{" "}
            <code className="rounded bg-slate-200 px-1 text-sm">saleName()</code>{" "}
            验证链上读流程。
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                当前合约状态
              </h2>
              <p className="text-sm text-slate-500">
                确保 Hardhat 本地链正在运行，且已执行部署与 ABI 导出命令。
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={loadRegistryAndRead}
              disabled={state === "loading"}
            >
              {state === "loading" ? "读取中..." : "重新查询"}
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {state === "loading" ? (
              <StateMessage
                title="正在连接链上..."
                description="请稍候，正在从本地 Hardhat RPC 读取 SaleFixed 详情。"
              />
            ) : state === "error" ? (
              <StateMessage
                tone="error"
                title="读取失败"
                description={errorMessage ?? "未知错误，请检查控制台。"}
              />
            ) : result ? (
              <ResultSummary result={result} />
            ) : (
              <StateMessage
                tone="warning"
                title="暂无数据"
                description="尚未获取到 SaleFixed 合约信息。请确认 registry 配置或点击重新查询。"
              />
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">排查步骤</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>确保本地 Hardhat 链通过 <code>pnpm -F @packages/contracts hardhat node</code> 启动。</li>
            <li>
              运行 <code>pnpm -F @packages/contracts hardhat run scripts/deploy.ts --network localhost</code> 部署合约。
            </li>
            <li>
              执行 <code>pnpm -F @packages/contracts export-abi</code> 更新 registry ABI。
            </li>
            <li>
              重新启动后端并访问 <code>/api/v1/registry</code>，确认返回数据包含{" "}
              <code>SaleFixed.localhost</code>。
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}

interface StateMessageProps {
  title: string;
  description: string;
  tone?: "default" | "error" | "warning";
}

function StateMessage({
  title,
  description,
  tone = "default",
}: StateMessageProps) {
  const colorClasses = useMemo(() => {
    switch (tone) {
      case "error":
        return "border-rose-200 bg-rose-50 text-rose-700";
      case "warning":
        return "border-amber-200 bg-amber-50 text-amber-700";
      default:
        return "border-slate-200 bg-slate-100 text-slate-700";
    }
  }, [tone]);

  return (
    <div className={`rounded-lg border px-4 py-3 ${colorClasses}`}>
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}

interface ResultSummaryProps {
  result: ContractReadResult;
}

function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <dt className="text-sm font-medium text-slate-500">合约地址</dt>
        <dd className="mt-1 break-all font-mono text-sm text-slate-900">
          {result.address}
        </dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <dt className="text-sm font-medium text-slate-500">链 ID</dt>
        <dd className="mt-1 font-mono text-sm text-slate-900">
          {result.chainId}
        </dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <dt className="text-sm font-medium text-slate-500">Owner 地址</dt>
        <dd className="mt-1 break-all font-mono text-sm text-slate-900">
          {result.owner}
        </dd>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <dt className="text-sm font-medium text-slate-500">Sale 名称</dt>
        <dd className="mt-1 font-mono text-sm text-slate-900">
          {result.saleName}
        </dd>
      </div>
    </dl>
  );
}

function normalizeContractEntry(entry: RegistryContractEntry) {
  const address = entry.address as Address;

  const chain: Chain = {
    ...hardhat,
    id: entry.chainId,
    rpcUrls: {
      default: { http: [DEFAULT_RPC_URL] },
      public: { http: [DEFAULT_RPC_URL] },
    },
  };

  return {
    address,
    abi: entry.abi,
    chain,
    chainId: entry.chainId,
    rpcUrl: DEFAULT_RPC_URL,
  };
}
