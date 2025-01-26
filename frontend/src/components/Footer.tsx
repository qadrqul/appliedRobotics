import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-card border-t border-border flex items-center justify-center px-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-muted-foreground hover:text-foreground"
        asChild
      >
        <a
          href="https://github.com/qadrqul"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">@qadrqul</span>
        </a>
      </Button>
    </footer>
  );
}