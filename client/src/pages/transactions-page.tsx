import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 border rounded-lg bg-card/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {transaction.type === "deposit" ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                  <span
                    className={`font-medium ${
                      transaction.type === "deposit"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    ${transaction.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : transaction.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                  <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {transactions?.length === 0 && (
              <p className="text-center text-muted-foreground">
                No transactions yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
