import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { QRCodeSVG } from "qrcode.react";
import { Loader2 } from "lucide-react";

interface TeamStats {
  totalTeamMembers: number;
  totalTeamDeposits: number;
  totalTeamWithdrawn: number;
}

export default function TeamPage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery<TeamStats>({
    queryKey: ["/api/team/stats"],
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
          <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Team Members" value={stats?.totalTeamMembers} />
            <StatItem
              label="Team Deposits"
              value={stats?.totalTeamDeposits}
              prefix="$"
            />
            <StatItem
              label="Team Withdrawn"
              value={stats?.totalTeamWithdrawn}
              prefix="$"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={`https://example.com/ref/${user?.referralCode}`} size={200} />
          </div>
          <div className="text-center">
            <p className="text-sm mb-2">Share your referral code:</p>
            <code className="bg-muted px-4 py-2 rounded">{user?.referralCode}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatItem({
  label,
  value,
  prefix = "",
}: {
  label: string;
  value?: number;
  prefix?: string;
}) {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">
        {prefix}
        {value || 0}
      </div>
    </div>
  );
}
