import { 
  BarChart2, 
  Search, 
  Globe, 
  Bookmark, 
  Settings, 
  TrendingUp,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, active }: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors group",
        active 
          ? "bg-slate-800 text-white" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "text-nse-blue" : "group-hover:text-slate-300")} />
      <span className="text-sm font-medium tracking-tight">{label}</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-terminal-border bg-[#0f172a] flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-terminal-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-nse-blue rounded flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide text-white">EQUITY DISCOVERY</span>
            <span className="text-[10px] text-slate-500 font-mono">TERMINAL v2.0</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market</div>
          <SidebarItem icon={Search} label="Discovery Engine" active />
          <SidebarItem icon={Globe} label="Market Overview" />
          <SidebarItem icon={BarChart2} label="Sector Analysis" />
        </div>

        <div className="space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Portfolio</div>
          <SidebarItem icon={Bookmark} label="Watchlist" />
          <SidebarItem icon={Layers} label="Screeners" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-terminal-border">
        <SidebarItem icon={Settings} label="System Settings" />
      </div>
    </aside>
  );
}
