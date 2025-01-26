import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  onOpenSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ onOpenSidebar, isSidebarOpen }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="bg-card border-b border-border h-16 px-4 flex items-center">
      {isMobile && !isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="mr-4"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
      <div className="ml-auto flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          Welcome, {user?.username}
        </span>
      </div>
    </div>
  );
}