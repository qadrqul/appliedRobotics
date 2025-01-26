import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCircle, 
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Logs", path: "/logs" },
  { icon: Users, label: "Admin", path: "/admin", adminOnly: true },
  { icon: UserCircle, label: "Profile", path: "/profile" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-full bg-card w-64 p-4 transition-transform duration-200 ease-in-out z-40",
        !isOpen && "-translate-x-full",
        isMobile && "shadow-xl"
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-primary">ACPDR System</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        className="w-full mt-8"
        onClick={() => {
          logout();
          onClose();
        }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}