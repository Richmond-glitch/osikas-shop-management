import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("Other"),
  buyingPrice: varchar("buyingPrice", { length: 20 }).notNull(),
  sellingPrice: varchar("sellingPrice", { length: 20 }).notNull(),
  quantity: int("quantity").default(0).notNull(),
  minStockAlert: int("minStockAlert").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 255 }),
  totalAmount: varchar("totalAmount", { length: 20 }).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["paid", "credit"]).default("paid"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

export const salesItems = mysqlTable("salesItems", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: varchar("unitPrice", { length: 20 }).notNull(),
  subtotal: varchar("subtotal", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SalesItem = typeof salesItems.$inferSelect;
export type InsertSalesItem = typeof salesItems.$inferInsert;

export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["Restocking", "Rent", "Utilities", "Transport", "Salary", "Other"]).notNull(),
  description: text("description"),
  amount: varchar("amount", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

export const debts = mysqlTable("debts", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  amount: varchar("amount", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = typeof debts.$inferInsert;