# AGENTS.md

## 🧭 Purpose / 文档目的

本文件定义了在本仓库中运行的 AI 辅助 Agents 的角色分工、交付标准（DoD）与协作规则。  
新的版本强调：
- **每个 Phase 拆分为多个可验证 Goal**；
- **每个 Goal 仅涉及一个主要子系统（前端 / 后端 / 合约 / 公共包）**；
- **每个 Goal 完成后项目可立即运行或被人工验证**；
- **Zod 模块化取消**，各子模块直接使用普通 Zod 调用。

所有 Agents 必须遵循：
- 架构与技术标准：`docs/CODING_GUIDE.md`  
- 阶段规划：`docs/PHASE_NOTES.md`  

---

## 🏗 Monorepo Layout

root/
├─ apps/
│ ├─ control-plane/ # NestJS 后端控制面
│ └─ launchpad-web/ # Next.js 前端
│
├─ packages/
│ ├─ core/ # 公共类型、工具函数、轻量 Zod schema
│ ├─ ui/ # 前端 UI 组件库
│ ├─ wagmi-adapter/ # EVM 链交互 hooks
│ ├─ contracts/ # Solidity 合约模板与 ABI 输出
│ └─ toolbelt/ # 通用辅助函数（格式化、时间线等）
│
└─ docs/
├─ CODING_GUIDE.md
├─ PHASE_NOTES.md
└─ API_SPEC.md


---

## ⚙️ Agents Overview

| Agent | 范围 | 特点 | 验证方式 |
|-------|------|------|-----------|
| Architect | 架构与依赖关系 | 只生成结构与配置，不写业务逻辑 | 构建是否通过 |
| Frontend | apps/launchpad-web | 每次仅实现一个页面/组件/hook | 页面可渲染 |
| Backend | apps/control-plane | 每次仅实现一个 API / Prisma 实体 | curl / Postman 可返回 |
| Contracts | packages/contracts | 每次仅实现一个合约或事件 | hardhat test 可通过 |
| Core | packages/core | 每次仅实现单个 util/schema | 通过 `pnpm test` |
| DevOps | infra/ | 每次仅维护一项构建任务 | `pnpm dev` 可启动 |

---

## 🔁 New Execution Strategy

### 1. 细粒度迭代（Atomic Goals）
每个 Phase 拆解为多个 **Goal**，每个 Goal：
- 仅修改一个子系统；
- 完成后应能单独运行或被验证；
- 禁止批量跨模块改动。

### 2. 验证优先
每个 Goal 结束后必须：
- 能运行 `pnpm install && pnpm dev`；
- 无 TypeScript 编译错误；
- 至少能访问一个健康页面或健康 API。

### 3. 独立提交
每个 Goal 的实现单独提交到 Git；
禁止在同一提交中跨前后端/合约改动。

---

## 🎯 Agents Roles

### 🧩 Architect Agent
**职责：**
- 设计 monorepo 目录结构与 workspace 配置；
- 指定 inter-package 依赖；
- 审查 cross-package 调用是否合理。

**DoD：**
- `pnpm install` 成功；
- `pnpm build` 无错误；
- `pnpm dev` 可启动空壳项目。

---

### 💻 Frontend Agent
**职责：**
- 在 `apps/launchpad-web` 中开发页面、hooks、组件；
- 集成 wagmi（仅限 EVM）；
- 调用后端 API。

**DoD：**
- 页面渲染正常；
- TypeScript 校验通过；
- 控制台无 runtime error。

---

### ⚙️ Backend Agent
**职责：**
- 在 `apps/control-plane` 实现 API、Prisma 实体；
- 管理配置 CRUD；
- 不涉及链上操作。

**DoD：**
- API 可被 curl/Postman 访问；
- Prisma migration 成功；
- 返回格式符合约定。

---

### 🔐 Contracts Agent
**职责：**
- 实现单一合约或事件；
- 生成 ABI；
- 输出 registry。

**DoD：**
- 编译通过；
- 单元测试通过；
- ABI 同步至 `packages/contracts/dist`.

---

### 📦 Core Agent
**职责：**
- 维护公共工具与类型；
- 实现轻量 Zod schema；
- 提供跨模块 util。

**DoD：**
- 所有导出可被引用；
- `pnpm test` 通过；
- 代码可读性强（非声明文件）。

---

### 🧰 DevOps Agent
**职责：**
- 管理 docker-compose 与 CI/CD；
- 确保一键启动。

**DoD：**
- `pnpm dev` 启动成功；
- 端口映射正确；
- 日志无报错。

---

## 🧩 Collaboration Rules

1. **每次 Codex 执行仅针对一个 Goal**。  
   例：  
   > “根据 PHASE_NOTES.md 的 Phase 0 Goal 1，创建 monorepo 基础结构。”

2. **禁止跨模块修改。**  
   前端改动时，后端保持不变。

3. **人工验收优先。**  
   每个 Goal 完成后应能手动验证运行状态。

4. **日志规范。**  
   每个 Agent 在 commit 信息中标明目标，例如：
   ```feat(core): implement basic utils for Phase 0 Goal 1```

---

## ✅ Definition of Done (Global)

| 类别 | 验证方法 |
|------|-----------|
| 构建通过 | `pnpm build` 成功 |
| 可运行 | `pnpm dev` 启动无错误 |
| 类型正确 | 无 TypeScript 编译错误 |
| 无跨模块耦合 | import 路径仅限所属包 |
| 文档更新 | 修改后同步更新 `PHASE_NOTES.md` |

---

## 🧠 Execution Prompt for Codex

> “Follow `AGENTS.md` and `CODING_GUIDE.md`.  
> Execute only one Goal from the current Phase in `PHASE_NOTES.md`.  
> After completion, ensure the project runs with `pnpm install && pnpm dev`.”

---

**一句总结：**  
> 新版 AGENTS.md 强调“小步快跑、单模块改动、即时可验证”，  
> 让 Codex 逐步构建出稳定的 monorepo，而非一次性爆炸式生成。

