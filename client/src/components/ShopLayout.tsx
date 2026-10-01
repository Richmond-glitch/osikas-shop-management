import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface ShopLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ShopLayout({ children, activeTab, onTabChange }: ShopLayoutProps) {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "products", label: " Products" },
    { id: "sales", label: " Sales" },
    { id: "expenses", label: " Expenses" },
    { id: "debts", label: " Debts" },
    { id: "reports", label: "�� Reports" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-purple-600 to-purple-800 dark:from-purple-900 dark:to-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-purple-500 dark:border-purple-800">
          <h1 className={`font-bold text-lg ${sidebarOpen ? "" : "text-center"}`}>
            {sidebarOpen ? "🏪 Osika's Shop" : "🏪"}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-purple-600 font-semibold"
                  : "text-purple-100 hover:bg-purple-500 dark:hover:bg-purple-800"
              }`}
            >
              {sidebarOpen ? tab.label : tab.label.split(" ")[0]}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-500 dark:border-purple-800">
          <Button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            {sidebarOpen ? (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              ) : (
                <Menu className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              )}
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {tabs.find(t => t.id === activeTab)?.label.split(" ").slice(1).join(" ")}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">{children}</div>
      </div>
    </div>
  );
}
