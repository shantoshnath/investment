import { useMutation } from "@tanstack/react-query";
import { Task, UserTask } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Star, Trophy } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TaskCard({ task }: { task: Task }) {
  const { toast } = useToast();

  const startTaskMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/tasks/${task.id}/start`);
      return res.json() as Promise<UserTask>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task Started",
        description: "You have successfully started this task.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to start task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 animate-[shimmer_2s_infinite]" />

      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>{task.title}</span>
          </div>
          <div className="flex items-center text-xl font-bold text-primary">
            <DollarSign className="w-5 h-5" />
            <span>{task.investmentRequired}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-sm font-medium">{task.duration} min</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
            <div className="text-sm font-medium">${task.reward}</div>
            <div className="text-xs text-muted-foreground">Reward</div>
          </div>
        </div>

        <Button
          className="w-full bg-primary hover:bg-primary/90 transition-colors group relative overflow-hidden"
          onClick={() => startTaskMutation.mutate()}
          disabled={startTaskMutation.isPending}
        >
          <span className="relative z-10">
            {startTaskMutation.isPending ? "Starting..." : "Start Mission"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </Button>
      </CardContent>
    </Card>
  );
}