import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TasksPage from "@/pages/tasks-page";
import TeamPage from "@/pages/team-page";
import ProfilePage from "@/pages/profile-page";
import WithdrawPage from "@/pages/withdraw-page";
import DepositPage from "@/pages/deposit-page";
import TransactionsPage from "@/pages/transactions-page";
import NotFound from "@/pages/not-found";
import BottomNav from "@/components/navigation/bottom-nav";

function Router() {
  return (
    <div className="min-h-screen bg-background bg-cyber-grid bg-cyber relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      <div className="relative">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/tasks" component={TasksPage} />
          <ProtectedRoute path="/team" component={TeamPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/withdraw" component={WithdrawPage} />
          <ProtectedRoute path="/deposit" component={DepositPage} />
          <ProtectedRoute path="/transactions" component={TransactionsPage} />
          <ProtectedRoute path="/history" component={TransactionsPage} />
          <Route component={NotFound} />
        </Switch>
        <BottomNav />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;