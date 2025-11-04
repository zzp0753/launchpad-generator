# 合约模块快速指南

> 本文档面向对智能合约不熟悉的团队成员，介绍目前合约仓库的能力，以及如何在本地完成基础的编译、测试与部署操作。章节结构预留扩展空间，可随着后续 Goal 的推进直接补充。

## 1. 当前实现概览

### 1.1 `SaleFixed` 合约
- **继承关系**：基于 OpenZeppelin 的 `Ownable`，自动提供 `owner()`、`transferOwnership()` 等基础权限控制接口。
- **核心状态**：公开字符串 `saleName`，用于标识当前募资活动名称。
- **构造参数**：部署时传入 `saleName`，部署者自动成为合约所有者。
- **当前限制**：尚未实现资金承销、额度管理等逻辑，仅用于前端和后端读取合约所有者与名称，验证 ABI 链接是否正常。

> ✅ 设计目的：在 Phase 2 让前端通过 wagmi 读取 `owner()` 或 `saleName`，验证链上读请求与 ABI 流程打通。

## 2. 本地测试 / 运行 / 部署流程

### 2.1 环境准备
1. 安装 Node.js ≥ 18 与 pnpm ≥ 9（项目已锁定 `pnpm@9.11.0`）。
2. 在项目根目录执行一次 `pnpm install`，确保依赖和 TypeChain 类型生成完毕。

### 2.2 编译合约
```bash
pnpm --filter @packages/contracts build
```
- 如果首次编译，会自动下载 Solidity 0.8.24 编译器，并在 `packages/contracts/typechain-types` 下生成 TypeScript 类型。

### 2.3 启动本地链（可选，但推荐）
在一个终端窗口中执行：
```bash
pnpm --filter @packages/contracts hardhat node
```
- 会启动 Hardhat 内存链，默认监听 `http://127.0.0.1:8545`，并给出一组预置账户及私钥。

### 2.4 部署合约到本地链
在另一个终端窗口中执行：
```bash
pnpm --filter @packages/contracts hardhat run scripts/deploy.ts --network localhost
```
- 控制台会输出部署者地址与 `SaleFixed` 合约地址。
- 如需修改 `saleName`，可在命令前设置环境变量：`SALE_NAME="Demo Sale" pnpm --filter @packages/contracts hardhat run ...`

### 2.5 导出 ABI
```bash
pnpm --filter @packages/contracts export-abi
```
- `packages/contract-registry/abi/SaleFixed.json`：仅保留 ABI 字段，供前后端消费。
- `packages/contract-registry/abi/SaleFixed.full.json`：完整 Hardhat Artifact 快照，便于调试或扩展。

### 2.6 （预留）测试执行
- 当前阶段尚未添加合约测试文件，后续可在 `packages/contracts/test` 下新增对应用例。
- 一旦补充测试，可使用：`pnpm --filter @packages/contracts test`

## 3. 未来扩展占位
- **新增合约功能**：在本节补充接口说明、状态变量、事件定义。
- **多网络部署约定**：记录 `anvil`、`sepolia` 等网络的地址与部署步骤。
- **集成流程**：说明前端、后端如何消费 registry 与 ABI。

> 当后续 Goal 推进出现新的脚本或合约时，请直接在对应章节追加内容，保持目录结构不变，方便团队成员快速定位更新。
