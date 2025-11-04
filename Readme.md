# 🧠 Web3 Launchpad Control Plane

A full-stack **Web3 Launchpad control system** for EVM-based ecosystems — featuring a modular architecture, progressive phase development, and Codex-driven automation.

面向 EVM 生态的全栈式 Web3 Launchpad 控制面 —— 模块化设计、渐进式开发。

---

## 📘 Overview

本项目旨在通过 React + Next.js + wagmi + NestJS + Prisma + PostgreSQL 的现代栈，构建一个可复用的 Launchpad 控制面。

为实现渐进式、可验证的 AI 协作式开发，本仓库内包含以下关键文档：
- **`AGENTS.md`** — 定义项目中每个“Agent”的职责（前端、后端、合约、文档等）。
- **`CODING_GUIDE.md`** — 指定统一的技术栈、编码风格与模块约定。
<!-- - **`PHASE_NOTES.md`** — 记录完整的开发阶段（Phase）与每个阶段的任务（Goal），用于指导 Codex 按阶段逐步生成代码。 -->

这些文档共同定义了本项目的工程规范与 AI 自动生成规则。

`docker compose -f infra/docker-compose.yml up -d`

目前正在开发中，可关注本项目。

## ⚙️ 本地运行流程（Phase 2）

以下命令帮助你快速复现 Phase 2 的链上读流程。本地需要至少开启三个终端：

```bash
# 终端 A：启动 Hardhat 内存链
pnpm chain:dev

# 终端 B：部署合约并导出 ABI
pnpm contracts:deploy:local
pnpm contracts:abi:export

# 终端 C：启动前后端（turbo 会并行启动所有 dev 任务）
pnpm dev
```

启动成功后：
- 后端 `GET http://localhost:4000/api/v1/registry` 会返回含 ABI 的注册表；
- 前端 `http://localhost:3000/onchain/check` 将读取本地链上的 `SaleFixed.owner()` 与 `saleName()`。
