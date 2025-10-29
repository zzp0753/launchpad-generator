# CODING_GUIDE.md

## 🧭 Purpose / 文档目的

本文件定义了本仓库在实现过程中的 **统一技术规范与约定**。  
适用于 Codex / Cursor / Windsurf 等 AI 辅助工具，也适用于人工贡献者。  

目标：
1. 降低每个 Goal 的复杂度，使每个阶段都可独立验证；
2. 保证 `pnpm install && pnpm dev` 始终可运行；
3. 使用最新稳定版本（尤其是 Prisma ≥ **6.x**）；
4. 避免过度抽象，保持直观、易读的源码风格。

---

## 🧱 项目结构 (Monorepo Layout)

root/
├─ apps/
│ ├─ control-plane/ # NestJS 后端
│ └─ launchpad-web/ # Next.js 前端
│
├─ packages/
│ ├─ core/ # 公共工具与类型定义（含轻量 Zod）
│ ├─ ui/ # 共享 UI 组件库
│ ├─ wagmi-adapter/ # EVM 交互 hooks
│ ├─ contracts/ # Solidity 合约模板与 ABI 输出
│ └─ toolbelt/ # 通用工具（格式化、时间线等）
│
└─ docs/
├─ CODING_GUIDE.md
├─ PHASE_NOTES.md
└─ API_SPEC.md


---

## 🧩 技术栈版本要求

| 模块 | 技术 | 要求版本 |
|------|------|----------|
| 前端 | Next.js | 14.x |
| 前端 | React | 18.x |
| 前端 | wagmi | 最新稳定版 |
| 后端 | NestJS | 10.x |
| ORM | **Prisma** | **≥ 6.x (stable)** |
| 数据库 | PostgreSQL | 14+ |
| 智能合约 | Solidity | 0.8.24+ |
| 构建 | pnpm + turbo | 最新 LTS |

---

## ⚙️ 通用开发原则

### 1. 单一职责 (Atomic Goals)
- 每个 Goal 只修改一个包或一个功能；
- 完成后应能独立构建、运行、测试；
- 不允许一次性改动前后端或多包依赖。

### 2. 可运行性优先
- 所有阶段产物必须支持 `pnpm install && pnpm dev`；
- 如果需要 mock API，请先实现 mock 而非跳过。

### 3. TypeScript 严格模式
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 4. Import 限制

禁止跨包直接引用内部路径：
❌ import { something } from "../../core/src/utils"
✅ import { something } from "@core/utils"

## 🧠 Zod 使用规范

### 取消模块化

Zod 不再拆为多层模块化结构。
各包直接在需要时声明 schema，例如：
```
import { z } from "zod";

const LaunchpadConfigSchema = z.object({
  name: z.string().min(1),
  symbol: z.string().min(1),
  totalSupply: z.number().positive(),
});
```

### 约定：

* Schema 文件命名：*.schema.ts；
* Schema 必导出 TS 类型：
  ```export type LaunchpadConfig = z.infer<typeof LaunchpadConfigSchema>;```
* 不再使用嵌套链式 schema 拆分；
* 跨包共享 schema 时，放入 packages/core/schema/；
* 避免创建 “Schema factories”，保持直观。

## 💻 前端规范 (apps/launchpad-web)

### 框架与依赖

* Next.js + React + TypeScript + wagmi
* UI 框架：@shadcn/ui + tailwindcss
* 状态管理：React hooks（不使用 Redux）

### 代码约定
* 页面路径：pages/ 或 app/ 目录中；
* hooks 命名：useCommit, useClaim, useWhitelist；
* wagmi 调用必须封装在 hooks 中，不直接写在组件内；
* 所有交互使用 async/await + try/catch；
* 表单使用：
  ```
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  ```

### UI 原则

* 每个页面保持最少状态；
* 不依赖后端直接访问数据库；
* 对 API 使用 axios 封装；
* 所有错误通过 toast 显示。

## ⚙️ 后端规范 (apps/control-plane)

### 框架与依赖

* NestJS + Prisma + PostgreSQL
* Prisma 版本必须 ≥ 6.x

### 代码结构
```
apps/control-plane/src/
├─ main.ts
├─ app.module.ts
├─ modules/
│  ├─ project/
│  │  ├─ project.module.ts
│  │  ├─ project.service.ts
│  │  ├─ project.controller.ts
│  │  └─ project.dto.ts
│  ├─ user/
│  └─ ...
└─ prisma/
   └─ schema.prisma
```
### 数据库规范
* 所有迁移命令使用：```pnpm prisma migrate dev --name init```
* 每次 migration 必须有 down 逻辑；
* 所有模型字段加默认值与时间戳：
  ```
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ```

### API 设计

* 命名规则：/api/v1/{resource}
* 控制器命名：{resource}.controller.ts
* DTO 校验：使用 class-validator + class-transformer
* 日志使用 NestJS Logger，不写 console.log。
* 错误返回格式统一：```{ "success": false, "error": "MESSAGE" }```

## 🔐 智能合约规范 (packages/contracts)

### 工具链

* Hardhat + Ethers v6
* Solidity ^0.8.24
* 测试框架：Mocha + Chai

## 📦 公共包规范

### packages/core
* 存放公共 schema / utils / types；
* 注意语义化、可读性；
* 每个导出都应具备默认导出与命名导出。

### packages/ui

* 仅存放可复用的 UI 组件；
* 样式由 Tailwind 提供；
* 不包含业务逻辑。

### packages/wagmi-adapter

* 仅支持 EVM 链；
* 提供统一的链配置；
* 常用 hooks：```useAccount, useNetwork, useCommitTransaction```

## 🧪 测试与验证

### 单元测试
* 使用 Vitest 或 Jest；
* 命名规则：*.spec.ts；
* 只覆盖当前修改的功能。

### 集成测试
* E2E 路径：pnpm dev → open browser / API；
* 后端：curl + Supertest；
* 合约：pnpm test under contracts。

### 人工验证清单
每个 Goal 完成后必须验证：
* pnpm install 成功；
* pnpm dev 启动；
* 页面 / API 可访问；
* 无 TS 编译错误；
* 代码风格符合 ESLint + Prettier。

## 🧰 工具与开发体验

| 功能       | 工具                   |
| -------- | -------------------- |
| 包管理      | pnpm                 |
| 构建管理     | turborepo            |
| Lint     | ESLint + Prettier    |
| 类型检查     | TypeScript           |
| 日志       | pino / Nest Logger   |
| 监控       | Sentry               |
| 提交规范     | Conventional Commits |

## ✅ 验收标准 (Definition of Done)

| 类别    | 标准                   |
| ----- | -------------------- |
| 构建通过  | `pnpm build` 成功      |
| 可运行   | `pnpm dev` 无阻塞错误     |
| 类型正确  | TS 检查通过              |
| 代码整洁  | ESLint + Prettier 通过 |
| 数据库一致 | Prisma migrate 成功    |
| 功能验证  | 运行后手动验证正常            |

🧠 Codex Execution Prompt

Follow the implementation standards in CODING_GUIDE.md.
Execute only one Goal from the current Phase in PHASE_NOTES.md.
Use Prisma v6+ and ensure the project runs after pnpm install && pnpm dev.

---