import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  InsertProduct,
  sales,
  InsertSale,
  salesItems,
  InsertSalesItem,
  expenses,
  InsertExpense,
  debts,
  InsertDebt,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function getProducts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(products).orderBy(products.name);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(products).where(eq(products.id, id));
}

// Sales queries
export async function createSale(saleData: InsertSale, itemsData: InsertSalesItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const saleResult = await db.insert(sales).values(saleData);
  const saleId = (saleResult as any)[0]?.insertId || (saleResult as any).insertId;
  
  if (itemsData.length > 0 && saleId) {
    const itemsWithSaleId = itemsData.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      saleId: saleId as number,
    }));
    await db.insert(salesItems).values(itemsWithSaleId);
  }
  
  return { id: saleId };
}

export async function getSales() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(sales).orderBy(sales.createdAt);
}

export async function getSaleWithItems(saleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const sale = await db.select().from(sales).where(eq(sales.id, saleId)).limit(1);
  if (!sale[0]) return null;
  
  const items = await db.select().from(salesItems).where(eq(salesItems.saleId, saleId));
  return { ...sale[0], items };
}

// Expense queries
export async function createExpense(data: InsertExpense) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(expenses).values(data);
}

export async function getExpenses() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(expenses).orderBy(expenses.createdAt);
}

// Debt queries
export async function createDebt(data: InsertDebt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(debts).values(data);
}

export async function getDebts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(debts).where(eq(debts.status, "pending")).orderBy(debts.createdAt);
}

export async function markDebtAsPaid(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(debts).set({ status: "paid" }).where(eq(debts.id, id));
}

export async function deleteExpense(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(expenses).where(eq(expenses.id, id));
}

export async function deleteSale(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(salesItems).where(eq(salesItems.saleId, id));
  return db.delete(sales).where(eq(sales.id, id));
}

export async function deleteDebt(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(debts).where(eq(debts.id, id));
}
