import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ShopLayout from "@/components/ShopLayout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Sales from "@/pages/Sales";
import Expenses from "@/pages/Expenses";
import Debts from "@/pages/Debts";
import Reports from "@/pages/Reports";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

function ShopApp() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "sales":
        return <Sales />;
      case "expenses":
        return <Expenses />;
      case "debts":
        return <Debts />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ShopLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </ShopLayout>
  );
}

function LoginScreen() {
  const isDev = import.meta.env.DEV;

  const devLogin = async (role: "admin" | "client") => {
    await fetch("/api/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-sm">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">🏪</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Osika's Shop</h2>
        <p className="text-gray-600 mb-8">Management System</p>
        <Button
          onClick={() => (window.location.href = getLoginUrl())}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
          size="lg"
        >
          Sign In
        </Button>

        {isDev && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-3">Local dev login</p>
            <div className="flex gap-2">
              <Button
                onClick={() => devLogin("admin")}
                variant="outline"
                className="flex-1"
              >
                Sign in as Admin
              </Button>
              <Button
                onClick={() => devLogin("client")}
                variant="outline"
                className="flex-1"
              >
                Sign in as Client
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          {user ? <ShopApp /> : <LoginScreen />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
