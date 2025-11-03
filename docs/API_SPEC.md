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

