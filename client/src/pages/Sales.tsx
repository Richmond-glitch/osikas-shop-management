import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Sales() {
  const { data: products } = trpc.products.list.useQuery();
  const { data: sales, isLoading, refetch } = trpc.sales.list.useQuery();
  const createMutation = trpc.sales.create.useMutation();

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [customerName, setCustomerName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "credit">("paid");

  const selectedProductData = products?.find(p => p.id === selectedProduct);
  const totalAmount = selectedProductData ? (parseFloat(selectedProductData.sellingPrice) * parseInt(quantity)).toFixed(2) : "0.00";

  const handleRecordSale = async () => {
    if (!selectedProduct || !quantity) {
      toast.error("Please select a product and quantity");
      return;
    }

    try {
      await createMutation.mutateAsync({
        customerName: customerName || undefined,
        totalAmount,
        paymentStatus,
        items: [
          {
            productId: selectedProduct,
            quantity: parseInt(quantity),
            unitPrice: selectedProductData?.sellingPrice || "0",
            subtotal: totalAmount,
          },
        ],
      });

      if (paymentStatus === "credit") {
        // Create debt record
        // This would be handled by a separate mutation in a full implementation
      }

      toast.success("Sale recorded successfully");
      setSelectedProduct(null);
      setQuantity("1");
      setCustomerName("");
      setPaymentStatus("paid");
      refetch();
    } catch (error) {
      toast.error("Failed to record sale");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Record New Sale</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product *</label>
                <select
                  value={selectedProduct || ""}
                  onChange={e => setSelectedProduct(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Select Product --</option>
                  {products?.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (optional)</label>
                <Input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value as "paid" | "credit")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="paid">Paid</option>
                  <option value="credit">Credit (Pay Later)</option>
                </select>
              </div>
              <Button onClick={handleRecordSale} className="w-full bg-green-600 hover:bg-green-700">
                💰 Record Sale
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Sale Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Product:</p>
                <p className="font-semibold">{selectedProductData?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price per unit:</p>
                <p className="font-semibold">GHS {selectedProductData?.sellingPrice || "0.00"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity:</p>
                <p className="font-semibold">{quantity}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">Total Amount:</p>
                <p className="text-2xl font-bold text-purple-600">GHS {totalAmount}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sales History</h3>
        {sales && sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4">{sale.customerName || "Walk-in"}</td>
                    <td className="py-3 px-4">GHS {sale.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sale.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {sale.paymentStatus === "paid" ? "Paid" : "Credit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No sales recorded yet</p>
        )}
      </Card>
    </div>
  );
}
