import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Home, Users, Wallet, Upload, Download, History, Gift, Info, Download as DownloadIcon, Phone } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MenuDropdown() {
  const { user, logoutMutation } = useAuth();
  const avatarUrl = user?.avatarUrl || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-lg">
          <Menu className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <Link href="/profile">
          <DropdownMenuLabel className="flex items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={user?.username} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{user?.username}</span>
          </DropdownMenuLabel>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span>Balance: ${user?.balance}</span>
        </DropdownMenuItem>

        <Link href="/deposit">
          <DropdownMenuItem className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Deposit</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/withdraw">
          <DropdownMenuItem className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Withdraw</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/history">
          <DropdownMenuItem className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Order History</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/transactions">
          <DropdownMenuItem className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Transaction History</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/rewards">
          <DropdownMenuItem className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>My Reward Points</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <Link href="/">
          <DropdownMenuItem className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/team">
          <DropdownMenuItem className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/about">
          <DropdownMenuItem className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>About Us</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/download">
          <DropdownMenuItem className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            <span>Download App</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/contact">
          <DropdownMenuItem className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Contact Us</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={handleLogout}>
          <Download className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}