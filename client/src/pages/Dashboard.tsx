import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: metrics, isLoading } = trpc.dashboard.metrics.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: metrics?.totalProducts || 0,
      color: "from-purple-500 to-purple-600",
      icon: "📦",
    },
    {
      title: "Today's Sales",
      value: `GHS ${metrics?.todaySales || "0.00"}`,
      color: "from-green-500 to-green-600",
      icon: "",
    },
    {
      title: "Monthly Sales",
      value: `GHS ${metrics?.monthlySales || "0.00"}`,
      color: "from-blue-500 to-blue-600",
      icon: "📈",
    },
    {
      title: "Total Sales",
      value: `GHS ${metrics?.totalSales || "0.00"}`,
      color: "from-indigo-500 to-indigo-600",
      icon: "",
    },
    {
      title: "Today's Expenses",
      value: `GHS ${metrics?.todayExpenses || "0.00"}`,
      color: "from-orange-500 to-orange-600",
      icon: "",
    },
    {
      title: "Total Expenses",
      value: `GHS ${metrics?.totalExpenses || "0.00"}`,
      color: "from-red-500 to-red-600",
      icon: "📊",
    },
    {
      title: "Outstanding Debts",
      value: `GHS ${metrics?.totalDebts || "0.00"}`,
      color: "from-yellow-500 to-yellow-600",
      icon: "",
    },
    {
      title: "Total Profit",
      value: `GHS ${metrics?.profit || "0.00"}`,
      color: "from-emerald-500 to-emerald-600",
      icon: "🎯",
    },
    {
      title: "Low Stock Items",
      value: metrics?.lowStockCount || 0,
      color: "from-pink-500 to-pink-600",
      icon: "⚠️",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <Card
            key={idx}
            className={`bg-gradient-to-br ${stat.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">GHS {metrics?.totalSales || "0.00"}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">GHS {metrics?.totalExpenses || "0.00"}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-blue-600">GHS {metrics?.profit || "0.00"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
