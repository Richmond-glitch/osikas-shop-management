import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Shop Management System", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("Products", () => {
    it("should list products", async () => {
      const products = await caller.products.list();
      expect(Array.isArray(products)).toBe(true);
    });

    it("should create a product", async () => {
      const result = await caller.products.create({
        name: "Test Product",
        category: "Food",
        buyingPrice: "10.00",
        sellingPrice: "15.00",
        quantity: 100,
        minStockAlert: 10,
      });
      expect(result).toBeDefined();
    });

    it("should get a product by id", async () => {
      const created = await caller.products.create({
        name: "Test Product",
        category: "Food",
        buyingPrice: "10.00",
        sellingPrice: "15.00",
        quantity: 100,
      });

      if (created && typeof created === "object" && "insertId" in created) {
        const product = await caller.products.get({ id: (created as any).insertId });
        expect(product).toBeDefined();
        expect(product?.name).toBe("Test Product");
      }
    });
  });

  describe("Sales", () => {
    it("should list sales", async () => {
      const sales = await caller.sales.list();
      expect(Array.isArray(sales)).toBe(true);
    });

    it("should create a sale", async () => {
      const result = await caller.sales.create({
        customerName: "John Doe",
        totalAmount: "100.00",
        paymentStatus: "paid",
        items: [
          {
            productId: 1,
            quantity: 2,
            unitPrice: "50.00",
            subtotal: "100.00",
          },
        ],
      });
      expect(result).toBeDefined();
    });
  });

  describe("Expenses", () => {
    it("should list expenses", async () => {
      const expenses = await caller.expenses.list();
      expect(Array.isArray(expenses)).toBe(true);
    });

    it("should create an expense", async () => {
      const result = await caller.expenses.create({
        type: "Rent",
        description: "Monthly rent",
        amount: "500.00",
      });
      expect(result).toBeDefined();
    });
  });

  describe("Debts", () => {
    it("should list debts", async () => {
      const debts = await caller.debts.list();
      expect(Array.isArray(debts)).toBe(true);
    });

    it("should create a debt", async () => {
      const result = await caller.debts.create({
        saleId: 1,
        customerName: "Jane Doe",
        amount: "50.00",
      });
      expect(result).toBeDefined();
    });
  });

  describe("Dashboard", () => {
    it("should return metrics", async () => {
      const metrics = await caller.dashboard.metrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalProducts).toBeGreaterThanOrEqual(0);
      expect(metrics.totalSales).toBeDefined();
      expect(metrics.totalExpenses).toBeDefined();
      expect(metrics.totalDebts).toBeDefined();
      expect(metrics.profit).toBeDefined();
    });

    it("should calculate profit correctly", async () => {
      const metrics = await caller.dashboard.metrics();
      const profit = parseFloat(metrics.profit);
      const sales = parseFloat(metrics.totalSales);
      const expenses = parseFloat(metrics.totalExpenses);
      expect(profit).toBe(sales - expenses);
    });
  });
});
