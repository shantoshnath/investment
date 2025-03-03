import { Home, ListTodo, Users, MessagesSquare, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function BottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user || location === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="grid grid-cols-5 gap-1 p-2">
        <NavItem icon={<Home />} label="Home" to="/" active={location === "/"} />
        <NavItem icon={<ListTodo />} label="Tasks" to="/tasks" active={location === "/tasks"} />
        <NavItem icon={<Users />} label="Team" to="/team" active={location === "/team"} />
        <NavItem icon={<MessagesSquare />} label="Online" isExternal href="https://www.tawk.to" active={false} />
        <NavItem icon={<User />} label="Me" to="/profile" active={location === "/profile"} />
      </div>
    </nav>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
} & (
  | { to: string; isExternal?: never; href?: never }
  | { href: string; isExternal: true; to?: never }
);

function NavItem({ icon, label, active, to, href, isExternal }: NavItemProps) {
  const className = `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
    active ? "text-primary" : "text-muted-foreground hover:text-primary"
  }`;

  if (isExternal && href) {
    return (
      <button
        className={className}
        onClick={() => window.open(href, '_blank')}
      >
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </button>
    );
  }

  return (
    <Link href={to!}>
      <button className={className}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </button>
    </Link>
  );
}