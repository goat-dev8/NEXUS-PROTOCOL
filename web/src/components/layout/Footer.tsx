import { Github, Twitter, MessageCircle, FileText } from "lucide-react";

export const Footer = () => {
  const links = [
    { label: "Docs", icon: FileText, href: "#" },
    { label: "GitHub", icon: Github, href: "#" },
    { label: "Discord", icon: MessageCircle, href: "#" },
    { label: "Twitter", icon: Twitter, href: "#" },
  ];

  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">N</span>
            </div>
            <span className="font-bold text-lg gradient-text">NEXUS PROTOCOL</span>
          </div>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Nexus Protocol. Built on Polygon.</p>
          <p className="mt-1">Privacy-First AI Yield Aggregator</p>
        </div>
      </div>
    </footer>
  );
};
