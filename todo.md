# Osika's Shop Management System - TODO

## Core Features

### Database & Backend
- [x] Create database schema for products, sales, expenses, debts, and sales_items
- [x] Implement product CRUD procedures (create, read, update, delete, list)
- [x] Implement sales transaction procedures (create sale, list sales, get sales by date)
- [x] Implement expense procedures (create, list, get by date/type)
- [x] Implement debt procedures (create, list, mark as paid)
- [x] Implement dashboard metrics procedures (today's sales, monthly sales, total sales, expenses, debts)
- [x] Implement reporting procedures (profit calculation, financial summary)

### Frontend - Core UI
- [x] Create ShopLayout with sidebar navigation
- [x] Build Dashboard page with real-time metrics cards
- [x] Build Products page with inventory management (add, edit, delete)
- [x] Build POS/Sales page with transaction recording
- [x] Build Sales History page with transaction list
- [x] Build Expenses page with expense tracking and filtering
- [x] Build Debts page with debt management
- [x] Build Reports page with financial summary

### Frontend - Features
- [x] Implement authentication and user context
- [x] Implement mark-as-paid functionality for debts
- [x] Add loading states and error handling
- [x] Add success/error toast notifications
- [x] Fix OAuth callback session cookie handling
- [x] Fix SameSite cookie policy for cross-origin requests
- [ ] Add product search and filtering
- [ ] Add date range filtering for sales and expenses
- [ ] Add expense type filtering
- [ ] Add clear all data with confirmation dialog

### Testing
- [x] Write vitest for product procedures
- [x] Write vitest for sales procedures
- [x] Write vitest for expense procedures
- [x] Write vitest for debt procedures
- [x] Write vitest for dashboard metrics procedures
- [x] All tests passing (12/12)
- [x] Updated auth logout test for lax SameSite policy

### Bug Fixes
- [x] Fixed missing session cookie issue in OAuth callback
- [x] Changed SameSite policy from "none" to "lax" for better cookie handling
- [x] Verified credentials are included in trpc fetch requests

### Deployment
- [x] Complete implementation
- [x] Verify all features work end-to-end
- [x] Fix authentication flow
- [ ] Save checkpoint with auth fix
