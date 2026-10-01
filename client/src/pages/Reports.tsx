import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Reports() {
  const { data: metrics, isLoading } = trpc.dashboard.metrics.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const profitMargin = metrics?.totalSales
    ? (((parseFloat(metrics.profit) / parseFloat(metrics.totalSales)) * 100).toFixed(2))
    : "0.00";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="text-2xl font-bold text-green-600">GHS {metrics?.totalSales || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Expenses:</span>
              <span className="text-2xl font-bold text-red-600">GHS {metrics?.totalExpenses || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Outstanding Debts:</span>
              <span className="text-2xl font-bold text-yellow-600">GHS {metrics?.totalDebts || "0.00"}</span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-blue-50 p-3 rounded">
              <span className="text-gray-800 font-semibold">Net Profit:</span>
              <span className="text-3xl font-bold text-blue-600">GHS {metrics?.profit || "0.00"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Profit Margin:</span>
              <span className="text-2xl font-bold text-purple-600">{profitMargin}%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Products:</span>
              <span className="text-2xl font-bold text-indigo-600">{metrics?.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Low Stock Items:</span>
              <span className="text-2xl font-bold text-pink-600">{metrics?.lowStockCount || 0}</span>
            </div>
            <div className="flex justify-between items-center pt-3 bg-green-50 p-3 rounded">
              <span className="text-gray-800 font-semibold">Today's Sales:</span>
              <span className="text-2xl font-bold text-green-600">GHS {metrics?.todaySales || "0.00"}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Monthly Sales</p>
            <p className="text-3xl font-bold text-blue-600">GHS {metrics?.monthlySales || "0.00"}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600">Monthly Expenses</p>
            <p className="text-3xl font-bold text-orange-600">GHS {metrics?.monthlyExpenses || "0.00"}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-gray-600">Monthly Profit</p>
            <p className="text-3xl font-bold text-emerald-600">
              GHS {(parseFloat(metrics?.monthlySales || "0") - parseFloat(metrics?.monthlyExpenses || "0")).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Today's Sales</p>
            <p className="text-3xl font-bold text-green-600">GHS {metrics?.todaySales || "0.00"}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Today's Expenses</p>
            <p className="text-3xl font-bold text-red-600">GHS {metrics?.todayExpenses || "0.00"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
