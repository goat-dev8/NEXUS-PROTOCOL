import { Github, Twitter, MessageCircle, FileText, Shield } from "lucide-react";

export const Footer = () => {
  const links = [
    { label: "Docs", icon: FileText, href: "#" },
    { label: "GitHub", icon: Github, href: "#" },
    { label: "Discord", icon: MessageCircle, href: "#" },
    { label: "Twitter", icon: Twitter, href: "#" },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-base text-white">Nexus Protocol</span>
          </div>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-white/30">
          <p>© 2025 Nexus Protocol. Built on Polygon.</p>
          <p className="mt-1">Smart Yield Infrastructure with Privacy Pool</p>
        </div>
      </div>
    </footer>
  );
};
