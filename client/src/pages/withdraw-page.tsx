import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWithdrawalRequestSchema, WithdrawalRequest } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function WithdrawPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertWithdrawalRequestSchema),
    defaultValues: {
      amount: 0,
      withdrawalAddress: "",
      password: "",
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      withdrawalAddress: string;
      password: string;
    }) => {
      const res = await apiRequest("POST", "/api/withdrawals/request", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawals/requests"] });
      toast({
        title: "Withdrawal request submitted",
        description: "Your request is being processed.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit withdrawal request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: withdrawalRequests, isLoading } = useQuery<WithdrawalRequest[]>({
    queryKey: ["/api/withdrawals/requests"],
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
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Submit Withdrawal Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((data) => withdrawalMutation.mutate(data))}>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Available Balance: ${user?.balance}</p>
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  {...form.register("amount", { valueAsNumber: true })}
                />
                {form.formState.errors.amount && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Withdrawal Address"
                  {...form.register("withdrawalAddress")}
                />
                {form.formState.errors.withdrawalAddress && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.withdrawalAddress.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Account Password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={withdrawalMutation.isPending}
              >
                {withdrawalMutation.isPending
                  ? "Submitting request..."
                  : "Submit Withdrawal Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawalRequests?.map((request) => (
              <div
                key={request.id}
                className="p-4 border rounded-lg bg-card/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">${request.amount}</span>
                  <span
                    className={`text-sm ${
                      request.status === "approved"
                        ? "text-green-500"
                        : request.status === "rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground break-all">
                  {request.withdrawalAddress}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.adminNotes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {request.adminNotes}
                  </p>
                )}
              </div>
            ))}
            {withdrawalRequests?.length === 0 && (
              <p className="text-center text-muted-foreground">
                No withdrawal requests yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}