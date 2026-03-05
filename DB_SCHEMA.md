# EasyPOS Relational Database Schema

This document defines the core SQL schema for EasyPOS. It is technology-agnostic and can be implemented in PostgreSQL or MySQL with minor adjustments.

The goal is to support:

- Multi-tenant, multi-vendor separation.
- Multi-branch and multi-warehouse inventory.
- POS sales with online and offline sync.
- Purchasing, suppliers, returns.
- Commissions, notifications, and auditability.
- Fine-grained RBAC.

---

## 1. Conventions

- Primary keys:
  - `id` as primary key (`bigint` or `uuid`) unless stated otherwise.
- Multi-tenant isolation:
  - Most business tables include `tenant_id` (FK → `tenants.id`).
- Multi-vendor context:
  - Many tables include `vendor_id`, `branch_id`, and/or `warehouse_id`.
- Timestamps:
  - `created_at`, `updated_at` (`timestamp with time zone` recommended).
- Soft delete (where needed):
  - `deleted_at` (`timestamp`, nullable).
- Monetary values:
  - `decimal(12,4)` or similar, depending on DB.

---

## 2. Core Identity & Tenant Tables

### 2.1 tenants

| Column     | Type         | Nullable | Notes                     |
|-----------|--------------|----------|---------------------------|
| id        | bigint/uuid  | no       | PK                        |
| name      | varchar(255) | no       | Tenant display name       |
| code      | varchar(64)  | no       | Unique short code         |
| status    | enum         | no       | `active`, `inactive`      |
| created_at| timestamp    | no       |                           |
| updated_at| timestamp    | no       |                           |

Indexes:
- `unique(code)`

### 2.2 vendors

Represents a merchant/vendor under a tenant.

| Column                    | Type         | Nullable | Notes                         |
|--------------------------|--------------|----------|-------------------------------|
| id                       | bigint/uuid  | no       | PK                            |
| tenant_id                | bigint/uuid  | no       | FK → tenants.id               |
| name                     | varchar(255) | no       |                               |
| code                     | varchar(64)  | no       | Unique per tenant             |
| default_commission_rate  | decimal(5,2) | yes      | Percent (e.g. 10.00)          |
| created_at               | timestamp    | no       |                               |
| updated_at               | timestamp    | no       |                               |

Indexes:
- `unique(tenant_id, code)`
- `index(tenant_id)`

### 2.3 branches

Physical branch/store under a vendor.

| Column     | Type         | Nullable | Notes                         |
|-----------|--------------|----------|-------------------------------|
| id        | bigint/uuid  | no       | PK                            |
| tenant_id | bigint/uuid  | no       | FK → tenants.id               |
| vendor_id | bigint/uuid  | no       | FK → vendors.id               |
| name      | varchar(255) | no       |                               |
| code      | varchar(64)  | no       | Unique per vendor             |
| address   | text         | yes      |                               |
| city      | varchar(128) | yes      |                               |
| country   | varchar(64)  | yes      |                               |
| created_at| timestamp    | no       |                               |
| updated_at| timestamp    | no       |                               |

Indexes:
- `unique(vendor_id, code)`
- `index(tenant_id, vendor_id)`

### 2.4 warehouses

Storage locations; may or may not be attached to a branch.

| Column     | Type         | Nullable | Notes                                       |
|-----------|--------------|----------|---------------------------------------------|
| id        | bigint/uuid  | no       | PK                                          |
| tenant_id | bigint/uuid  | no       | FK → tenants.id                             |
| vendor_id | bigint/uuid  | no       | FK → vendors.id                             |
| branch_id | bigint/uuid  | yes      | FK → branches.id, nullable for central wh   |
| name      | varchar(255) | no       |                                             |
| code      | varchar(64)  | no       | Unique per vendor                           |
| type      | enum         | no       | `store`, `warehouse`, `virtual`             |
| created_at| timestamp    | no       |                                             |
| updated_at| timestamp    | no       |                                             |

Indexes:
- `unique(vendor_id, code)`
- `index(tenant_id, vendor_id, branch_id)`

---

## 3. Users, Roles, and Permissions (RBAC)

### 3.1 users

| Column            | Type         | Nullable | Notes                                   |
|------------------|--------------|----------|-----------------------------------------|
| id               | bigint/uuid  | no       | PK                                      |
| tenant_id        | bigint/uuid  | no       | FK → tenants.id                         |
| email            | varchar(255) | no       | Unique per tenant                       |
| password_hash    | varchar(255) | no       | Hashed password                         |
| full_name        | varchar(255) | yes      |                                         |
| phone            | varchar(32)  | yes      |                                         |
| is_platform_admin| boolean      | no       | For global superadmins                  |
| status           | enum         | no       | `active`, `inactive`, `locked`          |
| last_login_at    | timestamp    | yes      |                                         |
| created_at       | timestamp    | no       |                                         |
| updated_at       | timestamp    | no       |                                         |

Indexes:
- `unique(tenant_id, email)`
- `index(is_platform_admin)`

### 3.2 roles

| Column     | Type         | Nullable | Notes                              |
|-----------|--------------|----------|------------------------------------|
| id        | bigint/uuid  | no       | PK                                 |
| tenant_id | bigint/uuid  | no       | FK → tenants.id                    |
| name      | varchar(100) | no       | Display name                       |
| code      | varchar(64)  | no       | e.g. ADMIN, MANAGER, VENDOR, CASHIER |
| created_at| timestamp    | no       |                                    |
| updated_at| timestamp    | no       |                                    |

Indexes:
- `unique(tenant_id, code)`

### 3.3 permissions

| Column     | Type         | Nullable | Notes                                   |
|-----------|--------------|----------|-----------------------------------------|
| id        | bigint/uuid  | no       | PK                                      |
| tenant_id | bigint/uuid  | no       | FK → tenants.id                         |
| module    | varchar(64)  | no       | e.g. inventory, pos, purchasing        |
| action    | varchar(64)  | no       | e.g. read, create, update, delete, approve, export |
| code      | varchar(128) | no       | `module.action`                         |
| created_at| timestamp    | no       |                                         |
| updated_at| timestamp    | no       |                                         |

Indexes:
- `unique(tenant_id, code)`

### 3.4 role_permissions

| Column        | Type        | Nullable | Notes                |
|--------------|-------------|----------|----------------------|
| role_id      | bigint/uuid | no       | FK → roles.id        |
| permission_id| bigint/uuid | no       | FK → permissions.id  |

PK: `(role_id, permission_id)`

### 3.5 user_roles

| Column  | Type        | Nullable | Notes           |
|--------|-------------|----------|-----------------|
| user_id| bigint/uuid | no       | FK → users.id   |
| role_id| bigint/uuid | no       | FK → roles.id   |

PK: `(user_id, role_id)`

### 3.6 user_branch_assignments (optional but useful)

Link users to branches they can operate in (e.g. cashiers).

| Column   | Type        | Nullable | Notes                 |
|---------|-------------|----------|-----------------------|
| user_id | bigint/uuid | no       | FK → users.id         |
| branch_id| bigint/uuid| no       | FK → branches.id      |

PK: `(user_id, branch_id)`

---

## 4. Catalog and Products

### 4.1 categories

| Column     | Type         | Nullable | Notes                                 |
|-----------|--------------|----------|---------------------------------------|
| id        | bigint/uuid  | no       | PK                                    |
| tenant_id | bigint/uuid  | no       | FK → tenants.id                       |
| vendor_id | bigint/uuid  | yes      | FK → vendors.id, nullable for shared  |
| name      | varchar(255) | no       |                                       |
| parent_id | bigint/uuid  | yes      | FK → categories.id (self-relation)    |
| created_at| timestamp    | no       |                                       |
| updated_at| timestamp    | no       |                                       |

Indexes:
- `index(tenant_id, vendor_id)`
- `index(parent_id)`

### 4.2 products

| Column      | Type         | Nullable | Notes                                  |
|------------|--------------|----------|----------------------------------------|
| id         | bigint/uuid  | no       | PK                                     |
| tenant_id  | bigint/uuid  | no       | FK → tenants.id                        |
| vendor_id  | bigint/uuid  | no       | FK → vendors.id                        |
| category_id| bigint/uuid  | yes      | FK → categories.id                     |
| name       | varchar(255) | no       |                                        |
| sku        | varchar(64)  | no       | Unique per vendor                      |
| barcode    | varchar(64)  | yes      |                                        |
| description| text         | yes      |                                        |
| is_active  | boolean      | no       |                                        |
| created_at | timestamp    | no       |                                        |
| updated_at | timestamp    | no       |                                        |

Indexes:
- `unique(vendor_id, sku)`
- `index(vendor_id, barcode)`
- `index(tenant_id, vendor_id, category_id)`

### 4.3 product_units

Support multi-unit (piece, carton, kilo) with conversion to a base unit.

| Column           | Type         | Nullable | Notes                              |
|-----------------|--------------|----------|------------------------------------|
| id              | bigint/uuid  | no       | PK                                 |
| product_id      | bigint/uuid  | no       | FK → products.id                   |
| name            | varchar(64)  | no       | e.g. piece, carton, kilo          |
| code            | varchar(32)  | no       | internal code                      |
| conversion_factor| decimal(12,4)| no      | factor vs base unit (1 for base)  |
| is_base         | boolean      | no       | exactly one base unit per product |

Indexes:
- `index(product_id, is_base)`

### 4.4 product_pricing

Branch- or vendor-specific pricing.

| Column     | Type         | Nullable | Notes                                  |
|-----------|--------------|----------|----------------------------------------|
| id        | bigint/uuid  | no       | PK                                     |
| tenant_id | bigint/uuid  | no       | FK → tenants.id                        |
| vendor_id | bigint/uuid  | no       | FK → vendors.id                        |
| branch_id | bigint/uuid  | yes      | FK → branches.id; null = vendor-wide  |
| product_id| bigint/uuid  | no       | FK → products.id                       |
| unit_id   | bigint/uuid  | no       | FK → product_units.id                  |
| price     | decimal(12,4)| no       | Selling price                          |
| cost      | decimal(12,4)| yes      | Average cost                           |
| currency  | varchar(8)   | no       |                                        |
| valid_from| date         | yes      |                                        |
| valid_to  | date         | yes      |                                        |
| created_at| timestamp    | no       |                                        |
| updated_at| timestamp    | no       |                                        |

Indexes:
- `index(vendor_id, product_id)`
- `index(branch_id, product_id)`
- optional: `unique(branch_id, product_id, unit_id, valid_from)`

---

## 5. Inventory and Stock

### 5.1 stock

Current quantity per product per warehouse.

| Column       | Type         | Nullable | Notes                  |
|-------------|--------------|----------|------------------------|
| id          | bigint/uuid  | no       | PK                     |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id        |
| vendor_id   | bigint/uuid  | no       | FK → vendors.id        |
| warehouse_id| bigint/uuid  | no       | FK → warehouses.id     |
| product_id  | bigint/uuid  | no       | FK → products.id       |
| quantity    | decimal(18,4)| no       | In base units          |
| reorder_level|decimal(18,4)| yes      |                        |
| created_at  | timestamp    | no       |                        |
| updated_at  | timestamp    | no       |                        |

Indexes:
- `unique(warehouse_id, product_id)`
- `index(tenant_id, vendor_id, product_id)`

### 5.2 stock_movements

Immutable log of stock changes.

| Column         | Type         | Nullable | Notes                                         |
|----------------|--------------|----------|-----------------------------------------------|
| id             | bigint/uuid  | no       | PK                                            |
| tenant_id      | bigint/uuid  | no       | FK → tenants.id                               |
| vendor_id      | bigint/uuid  | no       | FK → vendors.id                               |
| warehouse_id   | bigint/uuid  | no       | FK → warehouses.id                            |
| product_id     | bigint/uuid  | no       | FK → products.id                              |
| source_type    | enum         | no       | `PO`, `SALE`, `ADJUSTMENT`, `TRANSFER`, `RETURN` |
| source_id      | bigint/uuid  | yes      | Reference to source table                     |
| quantity_change| decimal(18,4)| no       | +/- in base units                             |
| unit_cost      | decimal(12,4)| yes      | For cost tracking (optional)                  |
| reason         | varchar(255) | yes      | Free-text reason                              |
| created_at     | timestamp    | no       |                                               |
| created_by     | bigint/uuid  | yes      | FK → users.id                                 |

Indexes:
- `index(warehouse_id, product_id, created_at)`
- `index(source_type, source_id)`

### 5.3 stock_adjustments

Manual or system-triggered corrections.

| Column       | Type         | Nullable | Notes                         |
|-------------|--------------|----------|-------------------------------|
| id          | bigint/uuid  | no       | PK                            |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id               |
| vendor_id   | bigint/uuid  | no       | FK → vendors.id               |
| warehouse_id| bigint/uuid  | no       | FK → warehouses.id            |
| product_id  | bigint/uuid  | no       | FK → products.id              |
| previous_qty| decimal(18,4)| no       | Before adjustment             |
| new_qty     | decimal(18,4)| no       | After adjustment              |
| reason      | varchar(255) | yes      |                               |
| created_at  | timestamp    | no       |                               |
| created_by  | bigint/uuid  | yes      | FK → users.id                 |

---

## 6. Suppliers and Purchasing

### 6.1 suppliers

| Column     | Type         | Nullable | Notes                          |
|-----------|--------------|----------|--------------------------------|
| id        | bigint/uuid  | no       | PK                             |
| tenant_id | bigint/uuid  | no       | FK → tenants.id                |
| vendor_id | bigint/uuid  | no       | FK → vendors.id                |
| name      | varchar(255) | no       |                                |
| code      | varchar(64)  | no       | Unique per vendor              |
| email     | varchar(255) | yes      |                                |
| phone     | varchar(64)  | yes      |                                |
| address   | text         | yes      |                                |
| created_at| timestamp    | no       |                                |
| updated_at| timestamp    | no       |                                |

Indexes:
- `unique(vendor_id, code)`

### 6.2 purchase_orders

| Column          | Type         | Nullable | Notes                             |
|----------------|--------------|----------|-----------------------------------|
| id             | bigint/uuid  | no       | PK                                |
| tenant_id      | bigint/uuid  | no       | FK → tenants.id                   |
| vendor_id      | bigint/uuid  | no       | FK → vendors.id                   |
| branch_id      | bigint/uuid  | yes      | FK → branches.id                  |
| warehouse_id   | bigint/uuid  | yes      | FK → warehouses.id                |
| supplier_id    | bigint/uuid  | no       | FK → suppliers.id                 |
| po_number      | varchar(64)  | no       | Unique per vendor                 |
| status         | enum         | no       | `draft`, `approved`, `sent`, `partially_received`, `received`, `cancelled` |
| expected_date  | date         | yes      |                                   |
| total_amount   | decimal(12,4)| yes      |                                   |
| currency       | varchar(8)   | yes      |                                   |
| created_at     | timestamp    | no       |                                   |
| updated_at     | timestamp    | no       |                                   |
| approved_at    | timestamp    | yes      |                                   |
| approved_by    | bigint/uuid  | yes      | FK → users.id                     |

Indexes:
- `unique(vendor_id, po_number)`
- `index(supplier_id, status)`

### 6.3 purchase_order_items

| Column       | Type         | Nullable | Notes                      |
|-------------|--------------|----------|----------------------------|
| id          | bigint/uuid  | no       | PK                         |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id            |
| po_id       | bigint/uuid  | no       | FK → purchase_orders.id    |
| product_id  | bigint/uuid  | no       | FK → products.id           |
| unit_id     | bigint/uuid  | no       | FK → product_units.id      |
| ordered_qty | decimal(18,4)| no       | In selected unit           |
| received_qty| decimal(18,4)| no       | Default 0                  |
| unit_cost   | decimal(12,4)| no       |                             |
| discount    | decimal(12,4)| yes      | Per line discount amount   |
| tax_amount  | decimal(12,4)| yes      |                             |
| created_at  | timestamp    | no       |                             |

Indexes:
- `index(po_id)`

### 6.4 shipments

Represents actual shipment deliveries for POs.

| Column         | Type         | Nullable | Notes                         |
|---------------|--------------|----------|-------------------------------|
| id            | bigint/uuid  | no       | PK                            |
| tenant_id     | bigint/uuid  | no       | FK → tenants.id               |
| po_id         | bigint/uuid  | no       | FK → purchase_orders.id       |
| warehouse_id  | bigint/uuid  | no       | FK → warehouses.id            |
| shipment_number|varchar(64)  | yes      | Optional external ref         |
| status        | enum         | no       | `pending`, `received`, `partial` |
| expected_date | date         | yes      |                               |
| received_date | date         | yes      |                               |
| created_at    | timestamp    | no       |                               |
| updated_at    | timestamp    | no       |                               |

### 6.5 shipment_items

| Column       | Type         | Nullable | Notes                           |
|-------------|--------------|----------|---------------------------------|
| id          | bigint/uuid  | no       | PK                              |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id                 |
| shipment_id | bigint/uuid  | no       | FK → shipments.id               |
| po_item_id  | bigint/uuid  | no       | FK → purchase_order_items.id    |
| product_id  | bigint/uuid  | no       | FK → products.id                |
| unit_id     | bigint/uuid  | no       | FK → product_units.id           |
| received_qty| decimal(18,4)| no       | In selected unit                |
| unit_cost   | decimal(12,4)| no       |                                 |
| created_at  | timestamp    | no       |                                 |

### 6.6 supplier_price_history (optional, for price comparison)

| Column       | Type         | Nullable | Notes                         |
|-------------|--------------|----------|-------------------------------|
| id          | bigint/uuid  | no       | PK                            |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id               |
| supplier_id | bigint/uuid  | no       | FK → suppliers.id             |
| product_id  | bigint/uuid  | no       | FK → products.id              |
| unit_id     | bigint/uuid  | no       | FK → product_units.id         |
| price       | decimal(12,4)| no       |                               |
| currency    | varchar(8)   | no       |                               |
| effective_from|timestamp   | no       |                               |
| effective_to| timestamp    | yes      |                               |

Indexes:
- `index(supplier_id, product_id, effective_from)`

---

## 7. Sales, Payments, and Returns

### 7.1 shift_sessions

Cashier shift sessions.

| Column          | Type         | Nullable | Notes                          |
|----------------|--------------|----------|--------------------------------|
| id             | bigint/uuid  | no       | PK                             |
| tenant_id      | bigint/uuid  | no       | FK → tenants.id                |
| vendor_id      | bigint/uuid  | no       | FK → vendors.id                |
| branch_id      | bigint/uuid  | no       | FK → branches.id               |
| user_id        | bigint/uuid  | no       | FK → users.id (cashier)        |
| pos_terminal_id| varchar(64)  | no       | Local POS identifier           |
| opened_at      | timestamp    | no       |                                |
| closed_at      | timestamp    | yes      |                                |
| opening_float  | decimal(12,4)| yes      |                                |
| closing_amount | decimal(12,4)| yes      |                                |
| status         | enum         | no       | `open`, `closed`               |

Indexes:
- `index(branch_id, user_id, status)`

### 7.2 sales

| Column          | Type         | Nullable | Notes                                         |
|----------------|--------------|----------|-----------------------------------------------|
| id             | bigint/uuid  | no       | PK                                            |
| tenant_id      | bigint/uuid  | no       | FK → tenants.id                               |
| vendor_id      | bigint/uuid  | no       | FK → vendors.id                               |
| branch_id      | bigint/uuid  | no       | FK → branches.id                              |
| warehouse_id   | bigint/uuid  | yes      | FK → warehouses.id (stock source)             |
| shift_id       | bigint/uuid  | yes      | FK → shift_sessions.id                        |
| pos_terminal_id| varchar(64)  | no       | Local POS identifier                          |
| receipt_number | varchar(64)  | no       | Unique per branch                             |
| status         | enum         | no       | `draft`, `completed`, `voided`, `refunded`    |
| sale_datetime  | timestamp    | no       | Local datetime (UTC stored)                   |
| subtotal       | decimal(12,4)| no       | Before discounts/taxes                        |
| discount_total | decimal(12,4)| no       | Total discounts                               |
| tax_total      | decimal(12,4)| no       | Total taxes                                   |
| grand_total    | decimal(12,4)| no       | Final amount                                  |
| currency       | varchar(8)   | no       |                                               |
| customer_name  | varchar(255) | yes      |                                               |
| offline_reference|varchar(64) | yes      | Local ID for offline sync                     |
| created_at     | timestamp    | no       |                                               |
| updated_at     | timestamp    | no       |                                               |

Indexes:
- `unique(branch_id, receipt_number)`
- `index(tenant_id, vendor_id, branch_id, sale_datetime)`
- `index(offline_reference)`

### 7.3 sale_items

| Column        | Type         | Nullable | Notes                          |
|--------------|--------------|----------|--------------------------------|
| id           | bigint/uuid  | no       | PK                             |
| tenant_id    | bigint/uuid  | no       | FK → tenants.id                |
| sale_id      | bigint/uuid  | no       | FK → sales.id                  |
| product_id   | bigint/uuid  | no       | FK → products.id               |
| unit_id      | bigint/uuid  | no       | FK → product_units.id          |
| quantity     | decimal(18,4)| no       | In unit                         |
| unit_price   | decimal(12,4)| no       |                                 |
| line_subtotal| decimal(12,4)| no       | quantity * unit_price           |
| discount     | decimal(12,4)| yes      | line discount amount            |
| tax_amount   | decimal(12,4)| yes      |                                 |
| line_total   | decimal(12,4)| no       | final line total                |

Indexes:
- `index(sale_id)`
- `index(product_id)`

### 7.4 payments

Support multiple payments per sale (cash, card, wallet).

| Column      | Type         | Nullable | Notes                          |
|------------|--------------|----------|--------------------------------|
| id         | bigint/uuid  | no       | PK                             |
| tenant_id  | bigint/uuid  | no       | FK → tenants.id                |
| sale_id    | bigint/uuid  | no       | FK → sales.id                  |
| method     | enum         | no       | `cash`, `card`, `wallet`, `bank_transfer`, `other` |
| amount     | decimal(12,4)| no       |                                |
| currency   | varchar(8)   | no       |                                |
| reference  | varchar(128) | yes      | External transaction ref       |
| paid_at    | timestamp    | no       |                                |

Indexes:
- `index(sale_id)`
- `index(method, paid_at)`

### 7.5 customer_returns

High-level return document.

| Column         | Type         | Nullable | Notes                          |
|---------------|--------------|----------|--------------------------------|
| id            | bigint/uuid  | no       | PK                             |
| tenant_id     | bigint/uuid  | no       | FK → tenants.id                |
| vendor_id     | bigint/uuid  | no       | FK → vendors.id                |
| branch_id     | bigint/uuid  | no       | FK → branches.id               |
| warehouse_id  | bigint/uuid  | yes      | FK → warehouses.id             |
| sale_id       | bigint/uuid  | yes      | FK → sales.id                  |
| return_number | varchar(64)  | no       | Unique per branch              |
| status        | enum         | no       | `pending`, `completed`, `rejected` |
| reason        | varchar(255) | yes      |                                |
| total_refund  | decimal(12,4)| yes      |                                |
| created_at    | timestamp    | no       |                                |
| created_by    | bigint/uuid  | yes      | FK → users.id                  |

Indexes:
- `unique(branch_id, return_number)`
- `index(sale_id)`

### 7.6 customer_return_items

| Column        | Type         | Nullable | Notes                              |
|--------------|--------------|----------|------------------------------------|
| id           | bigint/uuid  | no       | PK                                 |
| tenant_id    | bigint/uuid  | no       | FK → tenants.id                    |
| return_id    | bigint/uuid  | no       | FK → customer_returns.id           |
| sale_item_id | bigint/uuid  | yes      | FK → sale_items.id, optional       |
| product_id   | bigint/uuid  | no       | FK → products.id                   |
| unit_id      | bigint/uuid  | no       | FK → product_units.id              |
| quantity     | decimal(18,4)| no       |                                    |
| refund_amount| decimal(12,4)| no       |                                    |
| reason       | varchar(255) | yes      |                                    |

Indexes:
- `index(return_id)`
- `index(product_id)`

### 7.7 supplier_returns

For returns to suppliers.

| Column         | Type         | Nullable | Notes                               |
|---------------|--------------|----------|-------------------------------------|
| id            | bigint/uuid  | no       | PK                                  |
| tenant_id     | bigint/uuid  | no       | FK → tenants.id                     |
| vendor_id     | bigint/uuid  | no       | FK → vendors.id                     |
| branch_id     | bigint/uuid  | yes      | FK → branches.id                    |
| warehouse_id  | bigint/uuid  | yes      | FK → warehouses.id                  |
| supplier_id   | bigint/uuid  | no       | FK → suppliers.id                   |
| return_number | varchar(64)  | no       | Unique per vendor                   |
| status        | enum         | no       | `pending`, `completed`, `cancelled` |
| reason        | varchar(255) | yes      |                                     |
| total_amount  | decimal(12,4)| yes      |                                     |
| created_at    | timestamp    | no       |                                     |
| created_by    | bigint/uuid  | yes      | FK → users.id                       |

### 7.8 supplier_return_items

| Column       | Type         | Nullable | Notes                             |
|-------------|--------------|----------|-----------------------------------|
| id          | bigint/uuid  | no       | PK                                |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id                   |
| supplier_return_id|bigint/uuid|no     | FK → supplier_returns.id          |
| product_id  | bigint/uuid  | no       | FK → products.id                  |
| unit_id     | bigint/uuid  | no       | FK → product_units.id             |
| quantity    | decimal(18,4)| no       |                                   |
| unit_cost   | decimal(12,4)| no       |                                   |
| reason      | varchar(255) | yes      |                                   |

---

## 8. Commissions

### 8.1 commissions

Stores commissions calculated per sale, per vendor, or per item.

| Column      | Type         | Nullable | Notes                               |
|------------|--------------|----------|-------------------------------------|
| id         | bigint/uuid  | no       | PK                                  |
| tenant_id  | bigint/uuid  | no       | FK → tenants.id                     |
| vendor_id  | bigint/uuid  | no       | FK → vendors.id                     |
| sale_id    | bigint/uuid  | no       | FK → sales.id                       |
| base_amount| decimal(12,4)| no       | Base for commission                 |
| rate       | decimal(5,2) | no       | Percentage                          |
| amount     | decimal(12,4)| no       | Calculated commission               |
| created_at | timestamp    | no       |                                     |

Indexes:
- `index(vendor_id, sale_id)`

Optionally, a `commission_rules` table can be added to define flexible rules.

---

## 9. Notifications

### 9.1 notifications

Generic notification records.

| Column       | Type         | Nullable | Notes                               |
|-------------|--------------|----------|-------------------------------------|
| id          | bigint/uuid  | no       | PK                                  |
| tenant_id   | bigint/uuid  | no       | FK → tenants.id                     |
| user_id     | bigint/uuid  | yes      | FK → users.id (target user)         |
| role_code   | varchar(64)  | yes      | Target role (e.g. MANAGER)          |
| type        | varchar(64)  | no       | e.g. `low_stock`, `high_cost`, `vendor_alert` |
| title       | varchar(255) | no       |                                     |
| message     | text         | no       |                                     |
| data_json   | json         | yes      | Extra payload                       |
| read_at     | timestamp    | yes      |                                     |
| created_at  | timestamp    | no       |                                     |

Indexes:
- `index(tenant_id, user_id, type, created_at)`

### 9.2 notification_channels (optional)

For storing push/email tokens.

| Column      | Type         | Nullable | Notes                               |
|------------|--------------|----------|-------------------------------------|
| id         | bigint/uuid  | no       | PK                                  |
| tenant_id  | bigint/uuid  | no       | FK → tenants.id                     |
| user_id    | bigint/uuid  | no       | FK → users.id                       |
| channel    | enum         | no       | `push`, `email`, `sms`              |
| endpoint   | varchar(255) | no       | Device token, email, phone, etc.    |
| created_at | timestamp    | no       |                                     |

---

## 10. Audit Logs

### 10.1 audit_logs

Tracks who changed what and when.

| Column        | Type         | Nullable | Notes                                  |
|--------------|--------------|----------|----------------------------------------|
| id           | bigint/uuid  | no       | PK                                     |
| tenant_id    | bigint/uuid  | no       | FK → tenants.id                        |
| user_id      | bigint/uuid  | yes      | FK → users.id                          |
| entity_type  | varchar(128) | no       | e.g. `Product`, `Stock`, `Sale`       |
| entity_id    | bigint/uuid  | no       |                                        |
| action       | enum         | no       | `create`, `update`, `delete`, `login` |
| before_data  | json         | yes      | Previous state                         |
| after_data   | json         | yes      | New state                              |
| created_at   | timestamp    | no       |                                        |
| ip_address   | varchar(64)  | yes      |                                        |
| user_agent   | varchar(255) | yes      |                                        |

Indexes:
- `index(tenant_id, entity_type, entity_id, created_at)`
- `index(user_id, created_at)`

---

## 11. AI Forecasting Support Tables (Optional but Recommended)

To support the AI forecasting microservice, you can add pre-aggregated tables.

### 11.1 product_daily_sales

Pre-computed aggregates per product per day per branch.

| Column      | Type         | Nullable | Notes                               |
|------------|--------------|----------|-------------------------------------|
| id         | bigint/uuid  | no       | PK                                  |
| tenant_id  | bigint/uuid  | no       | FK → tenants.id                     |
| vendor_id  | bigint/uuid  | no       | FK → vendors.id                     |
| branch_id  | bigint/uuid  | no       | FK → branches.id                    |
| product_id | bigint/uuid  | no       | FK → products.id                    |
| sales_date | date         | no       |                                     |
| quantity   | decimal(18,4)| no       | Sum of quantity sold                |
| revenue    | decimal(12,4)| no       | Sum of line_total                   |
| created_at | timestamp    | no       |                                     |

Indexes:
- `unique(branch_id, product_id, sales_date)`
- `index(vendor_id, product_id, sales_date)`

### 11.2 forecast_results

Store last recommendations per product.

| Column             | Type         | Nullable | Notes                          |
|-------------------|--------------|----------|--------------------------------|
| id                | bigint/uuid  | no       | PK                             |
| tenant_id         | bigint/uuid  | no       | FK → tenants.id                |
| vendor_id         | bigint/uuid  | no       | FK → vendors.id                |
| branch_id         | bigint/uuid  | no       | FK → branches.id               |
| product_id        | bigint/uuid  | no       | FK → products.id               |
| forecast_date     | date         | no       | Date forecast generated        |
| horizon_days      | int          | no       | Forecast horizon               |
| recommended_qty   | decimal(18,4)| yes      | Suggested reorder quantity     |
| risk_level        | enum         | yes      | `low`, `medium`, `high`       |
| notes             | varchar(255) | yes      |                                |
| created_at        | timestamp    | no       |                                |

Indexes:
- `index(branch_id, product_id, forecast_date)`

---

## 12. Relationships Summary (High Level)

- `tenants` 1–N `vendors`, `users`, `roles`, `products`, `branches`, `warehouses`, etc.
- `vendors` 1–N `branches`, `warehouses`, `products`, `suppliers`.
- `branches` 1–N `sales`, `customer_returns`, `shift_sessions`.
- `warehouses` 1–N `stock`, `stock_movements`, `shipments`.
- `products` 1–N `product_units`, `product_pricing`, `stock`, `sale_items`, `purchase_order_items`.
- `suppliers` 1–N `purchase_orders`, `supplier_returns`.
- `sales` 1–N `sale_items`, `payments`, `customer_returns`.
- `roles` N–M `permissions` via `role_permissions`.
- `users` N–M `roles` via `user_roles`.

This schema gives the backend engineer a solid foundation to:

- Implement normalized tables with clear FKs and indexes.
- Enforce tenant/vendor/branch scoping.
- Support reports, forecasts, and auditability.