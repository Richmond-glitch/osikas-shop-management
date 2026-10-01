import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function Debts() {
  const { data: debts, isLoading, refetch } = trpc.debts.list.useQuery();
  const markAsPaidMutation = trpc.debts.markAsPaid.useMutation();

  const handleMarkAsPaid = async (id: number) => {
    if (confirm("Mark this debt as paid?")) {
      try {
        await markAsPaidMutation.mutateAsync({ id });
        toast.success("Debt marked as paid");
        refetch();
      } catch (error) {
        toast.error("Failed to mark debt as paid");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const totalDebts = debts?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow">
        <p className="text-sm font-medium opacity-90">Outstanding Debts</p>
        <p className="text-4xl font-bold mt-2">GHS {totalDebts.toFixed(2)}</p>
        <p className="text-sm mt-2 opacity-75">{debts?.length || 0} pending debts</p>
      </Card>

      <Card className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Debt Management</h3>
        {debts && debts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {debts.map(debt => (
                  <tr key={debt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(debt.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium">{debt.customerName}</td>
                    <td className="py-3 px-4 font-semibold text-yellow-600">GHS {debt.amount}</td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => handleMarkAsPaid(debt.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Paid
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No outstanding debts</p>
        )}
      </Card>
    </div>
  );
}
