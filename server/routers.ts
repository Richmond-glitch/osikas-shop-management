import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createSale,
  getSales,
  getSaleWithItems,
  createExpense,
  getExpenses,
  createDebt,
  getDebts,
  markDebtAsPaid,
  deleteExpense,
  deleteSale,
  deleteDebt,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product procedures
  products: router({
    list: protectedProcedure.query(async () => {
      return getProducts();
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          category: z.string().optional(),
          buyingPrice: z.string(),
          sellingPrice: z.string(),
          quantity: z.number().int().min(0),
          minStockAlert: z.number().int().min(0).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createProduct({
          name: input.name,
          category: input.category || "Other",
          buyingPrice: input.buyingPrice,
          sellingPrice: input.sellingPrice,
          quantity: input.quantity,
          minStockAlert: input.minStockAlert || 0,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          category: z.string().optional(),
          buyingPrice: z.string().optional(),
          sellingPrice: z.string().optional(),
          quantity: z.number().int().optional(),
          minStockAlert: z.number().int().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteProduct(input.id);
      }),
  }),

  sales: router({
    list: protectedProcedure.query(async () => {
      return getSales();
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getSaleWithItems(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          customerName: z.string().optional(),
          totalAmount: z.string(),
          paymentStatus: z.enum(["paid", "credit"]),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number().int().min(1),
              unitPrice: z.string(),
              subtotal: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const { items, ...saleData } = input;
        const itemsData = items.map(item => ({
          ...item,
          saleId: 0,
        }));
        return createSale(saleData, itemsData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteSale(input.id);
      }),
  }),

  // Expense procedures
  expenses: router({
    list: protectedProcedure.query(async () => {
      return getExpenses();
    }),

    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["Restocking", "Rent", "Utilities", "Transport", "Salary", "Other"]),
          description: z.string().optional(),
          amount: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return createExpense(input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteExpense(input.id);
      }),
  }),

  // Debt procedures
  debts: router({
    list: protectedProcedure.query(async () => {
      return getDebts();
    }),

    create: protectedProcedure
      .input(
        z.object({
          saleId: z.number(),
          customerName: z.string(),
          amount: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return createDebt({
          ...input,
          status: "pending",
        });
      }),

    markAsPaid: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return markDebtAsPaid(input.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteDebt(input.id);
      }),
  }),

  // Dashboard metrics procedures
  dashboard: router({
    metrics: protectedProcedure.query(async () => {
      const allSales = await getSales();
      const allExpenses = await getExpenses();
      const allDebts = await getDebts();
      const allProducts = await getProducts();

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const todaySales = allSales.filter(s => {
        const saleDate = new Date((s.createdAt as any).getFullYear(), (s.createdAt as any).getMonth(), (s.createdAt as any).getDate());
        return saleDate.getTime() === today.getTime();
      });

      const monthlySales = allSales.filter(s => {
        const saleDate = s.createdAt as any;
        return saleDate.getFullYear() === now.getFullYear() && saleDate.getMonth() === now.getMonth();
      });

      const todaySalesTotal = todaySales.reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);
      const monthlySalesTotal = monthlySales.reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);
      const totalSalesAmount = allSales.reduce((sum, s) => sum + parseFloat(s.totalAmount), 0);

      const todayExpenses = allExpenses.filter(e => {
        const expenseDate = new Date((e.createdAt as any).getFullYear(), (e.createdAt as any).getMonth(), (e.createdAt as any).getDate());
        return expenseDate.getTime() === today.getTime();
      });

      const monthlyExpenses = allExpenses.filter(e => {
        const expenseDate = e.createdAt as any;
        return expenseDate.getFullYear() === now.getFullYear() && expenseDate.getMonth() === now.getMonth();
      });

      const todayExpensesTotal = todayExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const monthlyExpensesTotal = monthlyExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const totalExpensesAmount = allExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

      const totalDebtsAmount = allDebts.reduce((sum, d) => sum + parseFloat(d.amount), 0);

      const lowStockProducts = allProducts.filter(p => p.quantity <= (p.minStockAlert || 0));

      return {
        totalProducts: allProducts.length,
        todaySales: todaySalesTotal.toFixed(2),
        monthlySales: monthlySalesTotal.toFixed(2),
        totalSales: totalSalesAmount.toFixed(2),
        todayExpenses: todayExpensesTotal.toFixed(2),
        monthlyExpenses: monthlyExpensesTotal.toFixed(2),
        totalExpenses: totalExpensesAmount.toFixed(2),
        totalDebts: totalDebtsAmount.toFixed(2),
        lowStockCount: lowStockProducts.length,
        profit: (totalSalesAmount - totalExpensesAmount).toFixed(2),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
