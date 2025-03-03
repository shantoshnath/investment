import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SiTelegram,
  SiYoutube,
  SiFacebook,
} from "react-icons/si";
import { QRCodeSVG } from "qrcode.react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MenuDropdown from "@/components/navigation/menu-dropdown";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const avatarUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80";
  const referralLink = `https://example.com/ref/${user?.referralCode}`;

  const socialLinks = [
    { icon: <SiTelegram className="w-6 h-6" />, name: "Telegram", url: "https://t.me/" },
    { icon: <SiYoutube className="w-6 h-6" />, name: "YouTube", url: "https://youtube.com" },
    { icon: <SiFacebook className="w-6 h-6" />, name: "Facebook", url: "https://facebook.com" },
  ];

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type === 'link' ? 'Referral link' : 'Referral code'} copied!`,
      description: "You can now share it with your friends.",
    });
  };

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatarUrl} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{user?.username}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Balance: ${user?.balance}</div>
          <MenuDropdown />
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <form action="https://www.google.com/search" method="get" target="_blank" className="mb-4">
            <Input
              type="search"
              name="q"
              placeholder="Search Google..."
              className="w-full"
            />
          </form>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Quick Links</h3>
          <div className="grid grid-cols-3 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {link.icon}
                <span className="text-xs mt-1">{link.name}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Invite Friends</h3>
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={referralLink} size={200} />
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-1 block">Your Referral Link:</label>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(referralLink, 'link')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">Your Referral Code:</label>
              <div className="flex gap-2">
                <Input value={user?.referralCode} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(user?.referralCode || '', 'code')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Weather & News</h3>
          <p className="text-sm text-muted-foreground">
            Feature coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}