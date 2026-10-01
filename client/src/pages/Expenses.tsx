import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Expenses() {
  const { data: expenses, isLoading, refetch } = trpc.expenses.list.useQuery();
  const createMutation = trpc.expenses.create.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "Restocking" as const,
    description: "",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        type: formData.type,
        description: formData.description || undefined,
        amount: formData.amount,
      });
      toast.success("Expense recorded successfully");
      setFormData({ type: "Restocking", description: "", amount: "" });
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to record expense");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const todayExpenses = expenses?.filter(e => {
    const expenseDate = new Date(e.createdAt);
    const today = new Date();
    return (
      expenseDate.getFullYear() === today.getFullYear() &&
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getDate() === today.getDate()
    );
  }) || [];

  const monthExpenses = expenses?.filter(e => {
    const expenseDate = new Date(e.createdAt);
    const today = new Date();
    return (
      expenseDate.getFullYear() === today.getFullYear() &&
      expenseDate.getMonth() === today.getMonth()
    );
  }) || [];

  const todayTotal = todayExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const totalAll = expenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow">
          <p className="text-sm font-medium opacity-90">Today's Expenses</p>
          <p className="text-3xl font-bold mt-2">GHS {todayTotal.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow">
          <p className="text-sm font-medium opacity-90">Monthly Expenses</p>
          <p className="text-3xl font-bold mt-2">GHS {monthTotal.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg shadow">
          <p className="text-sm font-medium opacity-90">Total Expenses</p>
          <p className="text-3xl font-bold mt-2">GHS {totalAll.toFixed(2)}</p>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Expense Management</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          ➕ Record New Expense
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Record New Expense</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type *</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Restocking">Restocking</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Transport">Transport</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GHS) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Amount spent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save Expense
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Expense History</h3>
        {expenses && expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(expense.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">{expense.type}</td>
                    <td className="py-3 px-4">{expense.description || "-"}</td>
                    <td className="py-3 px-4 font-semibold">GHS {expense.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No expenses recorded yet</p>
        )}
      </Card>
    </div>
  );
}
