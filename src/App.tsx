import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/Shared/components/ui/sonner";
import { AuthProvider } from "./Shared/contexts";
import { AppRoutes } from "./Shared/routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="content">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
      <Toaster />
    </div>
  );
};

export default App;
