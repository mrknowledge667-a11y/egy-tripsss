# EasyPOS Backend Specification

This document is for the backend engineer to implement the EasyPOS backend according to the agreed architecture and database schema.

- Main reference architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md:1)
- Database schema: [`DB_SCHEMA.md`](DB_SCHEMA.md:1)

The backend can be implemented in any modern stack (e.g. [`Node.js.express()`](backend/express_app.ts:1), [`Python.fastapi()`](backend/fastapi_app.py:1), or [`Laravel.php()`](backend/laravel_routes.php:1)) as long as:

- REST principles and contracts in this spec are respected.
- Clean Architecture layering is followed.
- JWT-based auth and RBAC are correctly enforced.
- Offline sync flows and multi-tenant rules are respected.

---

## 1. High-Level Backend Architecture

### 1.1 Layering

Organize code by **layers** and **feature modules**:

- `domain/`
  - Entities, aggregates, value objects, domain services (pure logic, no framework).
- `application/`
  - Use cases (commands/queries), DTOs, input validation, orchestration.
- `infrastructure/`
  - ORM models (tables in [`DB_SCHEMA.md`](DB_SCHEMA.md:1)), repositories, external integrations (AI service, message broker, notification providers).
- `presentation/` or `interfaces/`
  - HTTP controllers, request/response mappers, middleware.

Example conceptual layout: [`backend/app.module()`](backend/app_module.ts:1)

### 1.2 Feature Modules

Split into feature modules:

- `auth` (login, JWT, refresh, password)
- `users` (user CRUD, role assignment)
- `rbac` (roles, permissions)
- `tenants_vendors` (tenants, vendors, branches, warehouses)
- `catalog` (categories, products, units, pricing)
- `inventory` (stock, stock movements, adjustments)
- `purchasing` (suppliers, POs, shipments, supplier returns)
- `pos_sales` (shift sessions, sales, sale items, payments, customer returns)
- `commissions`
- `notifications`
- `reports` (summary endpoints, optionally backed by aggregates)
- `ai_integration` (calls to forecasting microservice)
- `audit` (logging changes to critical entities)

Each module should have:

- `controllers/` or routes
- `services/` (application services / use cases)
- `repositories/` (talking to ORM)

---

## 2. Cross-Cutting Concerns

### 2.1 Authentication

- Use JWT access tokens (short-lived) with optional refresh tokens.
- JWT payload contains:
  - `sub` (user_id)
  - `tenant_id`
  - `roles` (array of codes such as ADMIN, MANAGER, VENDOR, CASHIER)
  - `branch_id` or `branch_ids` (optional)
  - `permissions_version` (for invalidating old tokens when permissions change)

Example JWT payload (JSON):

```json
{
  "sub": "user-123",
  "tenant_id": "tenant-1",
  "roles": ["MANAGER", "CASHIER"],
  "branch_id": "branch-5",
  "permissions_version": 3,
  "exp": 1716732000,
  "iat": 1716728400
}
```

### 2.2 Authorization & RBAC

- On each request:
  - Verify token and extract claims.
  - Check tenant_id on all accessed data.
  - Enforce role/permissions based on:
    - `roles` from JWT.
    - `permissions` from DB (via roles, permissions, role_permissions, user_roles).
- Use middleware/guards at route level to check:
  - Required permission codes per endpoint (e.g. `inventory.read`, `pos.sale.create`).
  - Optional: branch/warehouse access for POS and inventory endpoints.

### 2.3 Multi-Tenant Enforcement

- Every request must be scoped by `tenant_id` from JWT.
- Do not trust client-sent `tenant_id`, `vendor_id`, or `branch_id` without validating:
  - The resource belongs to the same tenant.
  - The user is allowed to access vendor/branch (via roles or assignments).

---

## 3. API Conventions

- Base path: `/api/v1`
- JSON request/response.
- Pagination: use `page`, `page_size` or `limit`, `offset`.
- Filtering via query params.
- Errors:
  - 400 - validation error
  - 401 - unauthorized
  - 403 - forbidden
  - 404 - not found / resource not in tenant scope
  - 409 - conflict (e.g. concurrent update, duplicate)
  - 500 - server error (masked to clients)

Standard response wrapper (optional):

```json
{
  "data": { },
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 135
  },
  "error": null
}
```

---

## 4. Auth & User Management

### 4.1 Auth Endpoints

#### POST `/api/v1/auth/login`

- Description: Authenticate user, return JWT and optional refresh token.
- Body:

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

- Success 200:

```json
{
  "access_token": "jwt-token",
  "refresh_token": "refresh-token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user-id",
    "tenant_id": "tenant-id",
    "full_name": "John Doe",
    "roles": ["ADMIN", "MANAGER"],
    "branch_ids": ["branch-id-1", "branch-id-2"]
  }
}
```

- Permissions: public (no auth). Implement lockout after repeated failures.

#### POST `/api/v1/auth/refresh`

- Refresh access token using refresh token.

#### POST `/api/v1/auth/logout`

- Invalidate refresh token (if stored).

### 4.2 Users

#### GET `/api/v1/users`

- List users within tenant.
- Query: `page`, `page_size`, `search`.
- Permissions: `users.read`, typical roles ADMIN, MANAGER.

#### POST `/api/v1/users`

- Create user (within tenant).
- Body (example):

```json
{
  "email": "cashier1@tenant.com",
  "full_name": "Cashier 1",
  "password": "Temp123!",
  "role_codes": ["CASHIER"],
  "branch_ids": ["branch-1"]
}
```

- Permissions: `users.create` (Admin / Manager with proper scope).

#### PATCH `/api/v1/users/{id}`

- Update user info, roles, branch assignments.

#### PATCH `/api/v1/users/{id}/status`

- Activate/deactivate user.

### 4.3 Roles & Permissions

- CRUD endpoints for `roles` and assignment of permission codes.
- Seed default permissions and roles (ADMIN, MANAGER, VENDOR, CASHIER).

---

## 5. Tenant, Vendor, Branch, Warehouse

### 5.1 Vendors

#### GET `/api/v1/vendors`

- List vendors for current tenant (in many cases, one per tenant).
- Permissions: `vendors.read`.

#### POST `/api/v1/vendors`

- Create vendor.
- Permissions: `vendors.create`.

### 5.2 Branches

#### GET `/api/v1/branches`

- Filter by `vendor_id`.
- Permissions: `branches.read`.

#### POST `/api/v1/branches`

- Create branch.

### 5.3 Warehouses

#### GET `/api/v1/warehouses`

- Filter by `vendor_id`, `branch_id`.
- Permissions: `warehouses.read`.

#### POST `/api/v1/warehouses`

- Create warehouse.

---

## 6. Catalog (Categories, Products, Units, Pricing)

### 6.1 Categories

#### GET `/api/v1/categories`

- Query: `vendor_id`, `parent_id`.
- Permissions: `catalog.read`.

#### POST `/api/v1/categories`

- Create category.

### 6.2 Products

#### GET `/api/v1/products`

- Filtering:
  - `vendor_id`
  - `category_id`
  - `search` (by name, sku, barcode)
- Permissions: `catalog.read`.

- Response example (shortened):

```json
{
  "data": [
    {
      "id": "prod-1",
      "vendor_id": "vend-1",
      "name": "Coca Cola 1L",
      "sku": "CC-1L",
      "barcode": "1234567890123",
      "category_id": "cat-1",
      "is_active": true
    }
  ],
  "meta": { "page": 1, "page_size": 20, "total": 1 },
  "error": null
}
```

#### POST `/api/v1/products`

- Create product with basic info.
- Body (example):

```json
{
  "vendor_id": "vend-1",
  "category_id": "cat-1",
  "name": "Coca Cola 1L",
  "sku": "CC-1L",
  "barcode": "1234567890123",
  "description": "Bottle 1L",
  "units": [
    { "name": "piece", "code": "PC", "is_base": true, "conversion_factor": 1 },
    { "name": "carton", "code": "CTN", "is_base": false, "conversion_factor": 12 }
  ]
}
```

- Server should:
  - Create product.
  - Create product_units.
  - Optionally seed default pricing.

#### GET `/api/v1/products/{id}`

- Detailed product with units, pricing.

### 6.3 Pricing

#### GET `/api/v1/pricing`

- Filter by `vendor_id`, `branch_id`, `product_id`.
- Permissions: `pricing.read`.

#### POST `/api/v1/pricing`

- Create or update price for a product-unit in a branch.
- Permissions: `pricing.update` (restrict to Manager/Admin).

---

## 7. Inventory

### 7.1 Stock

#### GET `/api/v1/stock`

- Filters:
  - `vendor_id`, `warehouse_id`, `product_id`, `branch_id` (via warehouse branch link).
- Permissions: `inventory.read`.

- Response example (simplified):

```json
{
  "data": [
    {
      "warehouse_id": "wh-1",
      "product_id": "prod-1",
      "quantity": 150.0,
      "reorder_level": 20.0
    }
  ]
}
```

### 7.2 Stock Movements

#### GET `/api/v1/stock-movements`

- Filters:
  - `warehouse_id`, `product_id`, `source_type`, `date_from`, `date_to`.
- Permissions: `inventory.read`.

### 7.3 Stock Adjustments

#### POST `/api/v1/stock-adjustments`

- Description: Adjust stock to match physical count.
- Body:

```json
{
  "warehouse_id": "wh-1",
  "product_id": "prod-1",
  "new_qty": 90.0,
  "reason": "Inventory count"
}
```

- Server-side:
  - Read current qty.
  - Insert record into `stock_adjustments`.
  - Insert `stock_movements` with delta.
  - Update `stock` table.
  - Audit log.

- Permissions: `inventory.adjust` (Admin / Manager only).

---

## 8. Suppliers & Purchasing

### 8.1 Suppliers

#### GET `/api/v1/suppliers`

- Filter by `vendor_id`.
- Permissions: `purchasing.read`.

#### POST `/api/v1/suppliers`

- Create supplier.

### 8.2 Purchase Orders (POs)

#### GET `/api/v1/purchase-orders`

- Filters:
  - `supplier_id`, `status`, `date_from`, `date_to`.
- Permissions: `purchasing.read`.

#### POST `/api/v1/purchase-orders`

- Create PO in `draft` status.

Body example:

```json
{
  "vendor_id": "vend-1",
  "branch_id": "branch-1",
  "warehouse_id": "wh-1",
  "supplier_id": "supp-1",
  "expected_date": "2026-06-15",
  "items": [
    { "product_id": "prod-1", "unit_id": "unit-1", "ordered_qty": 100, "unit_cost": 5.5 },
    { "product_id": "prod-2", "unit_id": "unit-3", "ordered_qty": 50, "unit_cost": 10.0 }
  ]
}
```

- Server:
  - Create `purchase_orders` record with `status = draft`.
  - Insert `purchase_order_items`.

#### PATCH `/api/v1/purchase-orders/{id}/approve`

- Change status from `draft` to `approved`.
- Permissions: `purchasing.approve`.

#### PATCH `/api/v1/purchase-orders/{id}/cancel`

- Cancel if not fully received.

### 8.3 Shipments / Receiving

#### POST `/api/v1/purchase-orders/{id}/shipments`

- Create shipment for receiving goods.

Body:

```json
{
  "warehouse_id": "wh-1",
  "shipment_items": [
    { "po_item_id": "poi-1", "received_qty": 60 },
    { "po_item_id": "poi-2", "received_qty": 40 }
  ],
  "received_date": "2026-06-16"
}
```

- Server:
  - Create `shipments` record.
  - Insert `shipment_items`.
  - Update `purchase_order_items.received_qty`.
  - Insert `stock_movements` (+) per product to warehouse.
  - Update `stock`.
  - Update `purchase_orders.status` (partial/received).
  - Audit log.

### 8.4 Supplier Returns

#### POST `/api/v1/supplier-returns`

- Body similar to:

```json
{
  "vendor_id": "vend-1",
  "branch_id": "branch-1",
  "warehouse_id": "wh-1",
  "supplier_id": "supp-1",
  "reason": "Damaged goods",
  "items": [
    { "product_id": "prod-1", "unit_id": "unit-1", "quantity": 10, "unit_cost": 5.5 }
  ]
}
```

- Server:
  - Create `supplier_returns` and `supplier_return_items`.
  - Insert `stock_movements` with negative quantity.
  - Update `stock`.
  - Optionally generate AP credit note.

---

## 9. POS, Sales, Payments, Returns

### 9.1 Shift Sessions

#### POST `/api/v1/pos/shift-sessions`

- Open a new shift.

Body:

```json
{
  "branch_id": "branch-1",
  "pos_terminal_id": "POS-DEVICE-001",
  "opening_float": 500.00
}
```

- Server:
  - Ensure no other open shift for that user+terminal.
  - Insert `shift_sessions`.

#### PATCH `/api/v1/pos/shift-sessions/{id}/close`

- Close shift; provide closing amount.

### 9.2 Sales (Online)

#### POST `/api/v1/pos/sales`

- Main endpoint to create a sale **online**.
- Body example:

```json
{
  "branch_id": "branch-1",
  "warehouse_id": "wh-1",
  "pos_terminal_id": "POS-DEVICE-001",
  "shift_id": "shift-123",
  "customer_name": "Walk-in",
  "items": [
    {
      "product_id": "prod-1",
      "unit_id": "unit-1",
      "quantity": 2,
      "unit_price": 10.0,
      "discount": 1.0
    }
  ],
  "payments": [
    { "method": "cash", "amount": 19.0 }
  ],
  "offline_reference": null
}
```

- Server (transaction):
  - Validate branch/warehouse belong to tenant & vendor.
  - Validate products, pricing.
  - Calculate line totals, subtotal, discounts, taxes, grand total.
  - Insert `sales`, `sale_items`, `payments`.
  - Insert `stock_movements` (-) per product from warehouse.
  - Update `stock`.
  - Generate `receipt_number` (unique per branch).
  - Insert `commissions` if configured.
  - Enqueue `notifications` if low stock or other triggers.
  - Return full sale summary.

- Response example:

```json
{
  "id": "sale-1",
  "receipt_number": "BR1-000001",
  "sale_datetime": "2026-06-15T12:01:30Z",
  "branch_id": "branch-1",
  "items": [...],
  "payments": [...],
  "subtotal": 20.0,
  "discount_total": 1.0,
  "tax_total": 0.0,
  "grand_total": 19.0
}
```

- Permissions: `pos.sale.create`.

### 9.3 Sales (Offline Sync)

#### POST `/api/v1/pos/sync/sales`

- Used by POS client to sync **multiple offline sales**.

Body example:

```json
{
  "branch_id": "branch-1",
  "warehouse_id": "wh-1",
  "pos_terminal_id": "POS-DEVICE-001",
  "sales": [
    {
      "offline_reference": "local-uuid-1",
      "sale_datetime": "2026-06-15T12:01:30Z",
      "customer_name": "Walk-in",
      "items": [
        { "product_id": "prod-1", "unit_id": "unit-1", "quantity": 2, "unit_price": 10.0, "discount": 1.0 }
      ],
      "payments": [
        { "method": "cash", "amount": 19.0 }
      ]
    }
  ]
}
```

- Server (for each sale in transaction or per-sale transactions):
  - Idempotency: use combination of `tenant_id`, `branch_id`, `pos_terminal_id`, `offline_reference` to detect duplicates.
  - If sale with same offline_reference already processed:
    - Return existing sale ID.
  - Else:
    - Same logic as online sale creation.
- Response example:

```json
{
  "results": [
    {
      "offline_reference": "local-uuid-1",
      "status": "success",
      "sale_id": "sale-1",
      "receipt_number": "BR1-000001"
    }
  ]
}
```

### 9.4 Customer Returns

#### POST `/api/v1/pos/returns`

- Create a return for an existing sale.

Body:

```json
{
  "sale_id": "sale-1",
  "branch_id": "branch-1",
  "warehouse_id": "wh-1",
  "reason": "Damaged item",
  "items": [
    { "sale_item_id": "si-1", "quantity": 1, "refund_amount": 9.5 }
  ]
}
```

- Server (transaction):
  - Create `customer_returns` and `customer_return_items`.
  - Insert `stock_movements` (+) back into warehouse.
  - Adjust `sales` status/amounts if necessary.
  - Insert negative `payments` or separate refund record.
  - Enforce permissions `pos.returns.create`.

---

## 10. Reports & Analytics (API Layer)

Implement read-only endpoints backed by primary DB or aggregates like `product_daily_sales`.

Examples:

- `GET /api/v1/reports/top-products`
  - Query: `vendor_id`, `branch_id`, `date_from`, `date_to`, `limit`.
- `GET /api/v1/reports/slow-moving`
- `GET /api/v1/reports/vendor-performance`
- `GET /api/v1/reports/profit-margin`

All require `reports.read`.

---

## 11. AI Forecasting Integration

The AI forecasting is a separate microservice. Backend responsibilities:

- Expose internal client to call AI service.
- Provide endpoints:

### 11.1 Trigger Forecast Calculation (Internal / Admin)

#### POST `/api/v1/forecast/run`

- Optional: trigger batch forecasting for a tenant/vendor.
- Body:

```json
{
  "vendor_id": "vend-1",
  "branch_ids": ["branch-1", "branch-2"],
  "horizon_days": 30
}
```

- Backend:
  - Aggregate sales data from `product_daily_sales` or from raw `sales`.
  - Call AI service endpoint (e.g. `POST /forecast/reorder-suggestions` on AI microservice).
  - Store results in `forecast_results`.

### 11.2 Get Forecast Suggestions (for UI)

#### GET `/api/v1/forecast/reorder-suggestions`

- Query: `vendor_id`, `branch_id`, `date`.
- Permissions: `inventory.read`, `purchasing.read`.

- Returns data from `forecast_results`:

```json
{
  "data": [
    {
      "product_id": "prod-1",
      "branch_id": "branch-1",
      "recommended_qty": 120.0,
      "risk_level": "high",
      "notes": "Stock will run out within 5 days under current trend"
    }
  ]
}
```

---

## 12. Notifications

### 12.1 Internal Triggers

Backend should generate notifications on:

- Low stock (stock.quantity < reorder_level).
- High cost or margin anomalies.
- Vendor performance issues (optionally, from reporting logic).

Whenever a sale or stock movement updates `stock`, check:

- If below `reorder_level`, insert a record into `notifications` with type `low_stock`.

### 12.2 API Endpoints

#### GET `/api/v1/notifications`

- Query:
  - `unread_only` (bool).
- Permissions: authenticated users only, scoped to their tenant and user_id or role.

#### PATCH `/api/v1/notifications/{id}/read`

- Mark notification as read.

---

## 13. Offline-First POS Support (Backend Responsibilities)

From backend side, to support offline-first POS (client uses local SQLite):

- Provide bulk fetch endpoints:
  - `GET /api/v1/pos/bootstrap`
    - Returns:
      - Products
      - Units
      - Pricing
      - Stock snapshot for specific branch/warehouse
      - User/shift related config
  - `GET /api/v1/pos/updates`
    - Returns changes since a given `last_sync_at` timestamp (products, prices, stock).

Example:

```json
GET /api/v1/pos/bootstrap?branch_id=branch-1&warehouse_id=wh-1
```

Response (simplified):

```json
{
  "products": [...],
  "product_units": [...],
  "pricing": [...],
  "stock_snapshot": [...],
  "config": {
    "currency": "EGP",
    "tax_rate": 0.14
  }
}
```

- Implement `POST /api/v1/pos/sync/sales` as described above for batching offline sales.
- Use idempotency keys (`offline_reference`) to avoid duplicates.
- Provide conflict strategies (e.g. if product was deactivated, respond with an error for that sale).

---

## 14. Audit Logging

The backend should insert records into `audit_logs` for critical actions:

- Product create/update/delete.
- Stock adjustments.
- Purchase order approvals and receipts.
- Sales creation, void, refunds.
- Role/permission changes.

A reusable helper like [`audit.log_change()`](backend/audit_service.ts:10) should be called from application services.

---

## 15. Non-Functional Requirements (Backend Level)

- Average POS-related endpoint latency < 300 ms under normal load.
- Transactions for critical write operations (sales, POs, stock adjustments).
- Proper indexing as described in [`DB_SCHEMA.md`](DB_SCHEMA.md:1).
- Error handling and logging with correlation IDs per request.
- Unit tests for domain logic and integration tests for critical APIs.

---

## 16. Minimal Folder Sketch (Example)

For reference (adapt or adjust to your language/framework):

```text
backend/
  src/
    domain/
      catalog/
      inventory/
      purchasing/
      pos_sales/
      users/
      rbac/
      notifications/
      ai_integration/
    application/
      catalog/
      ...
    infrastructure/
      orm/
      repositories/
      messaging/
      http_clients/
      ai_client/
    presentation/
      http/
        controllers/
        middlewares/
        routes/
    config/
    main.(ts|py|php)
```

- Keep business logic independent from framework-specific code.
- Separate read (queries) and write (commands) operations where natural (CQRS-lite).

This specification, together with [`ARCHITECTURE.md`](ARCHITECTURE.md:1) and [`DB_SCHEMA.md`](DB_SCHEMA.md:1), should give the backend engineer all details needed to implement the EasyPOS backend and its integrations.