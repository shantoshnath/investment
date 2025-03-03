import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Loader2 } from "lucide-react";

const depositSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
});

type DepositData = z.infer<typeof depositSchema>;

export default function DepositPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<DepositData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (data: DepositData) => {
      const res = await apiRequest("POST", "/api/payments/create", data);
      const paymentOrder = await res.json();

      // Redirect to UPay payment page
      if (paymentOrder.payUrl) {
        window.location.href = paymentOrder.payUrl;
      } else {
        throw new Error("Invalid payment URL received");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to initiate deposit",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((data) => depositMutation.mutate(data))}>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Current Balance: ${user?.balance}</p>
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
              <Button
                type="submit"
                className="w-full"
                disabled={depositMutation.isPending}
              >
                {depositMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Deposit with UPay
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Payments are processed securely through UPay
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}