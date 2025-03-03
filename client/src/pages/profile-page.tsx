import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LevelProgress from "@/components/profile/level-progress";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const avatarUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80";

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <Card className="mb-4">
        <CardContent className="pt-6 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src={avatarUrl} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{user?.username}</h2>
          <p className="text-muted-foreground">Member since 2024</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <LevelProgress level={user?.level || "Bronze"} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Balance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Current Balance" value={user?.balance} prefix="$" />
            <StatItem label="Total Deposits" value={user?.totalDeposits} prefix="$" />
            <StatItem label="Total Withdrawn" value={user?.totalWithdrawn} prefix="$" />
          </div>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}

function StatItem({
  label,
  value = 0,
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
        {value}
      </div>
    </div>
  );
}
