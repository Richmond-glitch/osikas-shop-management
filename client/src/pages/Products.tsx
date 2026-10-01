import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Products() {
  const { data: products, isLoading, refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    buyingPrice: "",
    sellingPrice: "",
    quantity: "",
    minStockAlert: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name || undefined,
          category: formData.category || undefined,
          buyingPrice: formData.buyingPrice || undefined,
          sellingPrice: formData.sellingPrice || undefined,
          quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
          minStockAlert: formData.minStockAlert ? parseInt(formData.minStockAlert) : undefined,
        });
        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          category: formData.category,
          buyingPrice: formData.buyingPrice,
          sellingPrice: formData.sellingPrice,
          quantity: parseInt(formData.quantity),
          minStockAlert: formData.minStockAlert ? parseInt(formData.minStockAlert) : 0,
        });
        toast.success("Product added successfully");
      }
      setFormData({ name: "", category: "Other", buyingPrice: "", sellingPrice: "", quantity: "", minStockAlert: "" });
      setShowForm(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Product deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      category: product.category,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      quantity: product.quantity.toString(),
      minStockAlert: product.minStockAlert?.toString() || "",
    });
    setEditingId(product.id);
    setShowForm(true);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", category: "Other", buyingPrice: "", sellingPrice: "", quantity: "", minStockAlert: "" });
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          ➕ Add New Product
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rice, Soap"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Food">Food</option>
                <option value="Drinks">Drinks</option>
                <option value="Toiletries">Toiletries</option>
                <option value="Household">Household</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (GHS) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.buyingPrice}
                onChange={e => setFormData({ ...formData, buyingPrice: e.target.value })}
                placeholder="Cost price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (GHS) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="Selling price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Initial stock"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Alert</label>
              <Input
                type="number"
                value={formData.minStockAlert}
                onChange={e => setFormData({ ...formData, minStockAlert: e.target.value })}
                placeholder="Alert when below this"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save Product
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-400 hover:bg-gray-500"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6 bg-white rounded-lg shadow">
        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Buying Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Selling Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">GHS {product.buyingPrice}</td>
                    <td className="py-3 px-4">GHS {product.sellingPrice}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.quantity <= (product.minStockAlert || 0)
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No products added yet</p>
        )}
      </Card>
    </div>
  );
}
