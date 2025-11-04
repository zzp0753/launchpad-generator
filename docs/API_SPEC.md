# API Specification

## Launchpad Endpoints

### `POST /api/v1/launchpads`

- **Description:** Create a launchpad configuration entry.
- **Request Body:**

  | Field      | Type     | Required | Notes                                   |
  | ---------- | -------- | -------- | --------------------------------------- |
  | `name`     | string   | Yes      | Minimum length 1                        |
  | `chain`    | string   | Yes      | Minimum length 1 (e.g. `EVM`)           |
  | `startTime`| ISO date | Yes      | ISO-8601 formatted date-time string     |
  | `endTime`  | ISO date | Yes      | Must be later than `startTime`          |

- **Response:** Returns the persisted launchpad object.

```json
{
  "id": "a0b1c2d3-e4f5-6789-9abc-def012345678",
  "name": "Alpha Launch",
  "chain": "EVM",
  "startTime": "2026-01-01T00:00:00.000Z",
  "endTime": "2026-01-15T00:00:00.000Z",
  "createdAt": "2025-11-03T12:44:00.000Z",
  "updatedAt": "2025-11-03T12:44:00.000Z"
}
```

### `GET /api/v1/launchpads`

- **Description:** Fetch all launchpad configurations ordered by creation time (descending).
- **Response:** Array of launchpad objects.

```json
[
  {
    "id": "11111111-1111-4111-8111-111111111111",
    "name": "Alpha Launch",
    "chain": "EVM",
    "startTime": "2026-01-01T00:00:00.000Z",
    "endTime": "2026-01-15T00:00:00.000Z",
    "createdAt": "2025-11-03T12:44:00.000Z",
    "updatedAt": "2025-11-03T12:44:00.000Z"
  }
]
```

### `GET /api/v1/launchpads/{id}`

- **Description:** Retrieve a launchpad configuration by ID.
- **Response:** Launchpad object matching the ID. Returns HTTP `404` when the launchpad does not exist.

- **Example Response:**

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Alpha Launch",
  "chain": "EVM",
  "startTime": "2026-01-01T00:00:00.000Z",
  "endTime": "2026-01-15T00:00:00.000Z",
  "createdAt": "2025-11-03T12:44:00.000Z",
  "updatedAt": "2025-11-03T12:44:00.000Z"
}
```

## Registry Endpoints

### `GET /api/v1/registry`

- **Description:** Return the contract registry JSON, enriched with ABI payloads for each contract/network combination.
- **Usage:** Frontend读取链上信息前，应先拉取该接口，获取目标网络的 `address`、`chainId` 以及 `abi`。
- **Response:**

```json
{
  "SaleFixed": {
    "localhost": {
      "chainId": 31337,
      "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      "abiPath": "abi/SaleFixed.json",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        }
      ]
    }
  }
}
```

- **Error Codes:**
  - `500 Internal Server Error`: ABI 文件缺失或解析失败（请重新执行 ABI 导出脚本）。
