import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { 
  Home, 
  Upload, 
  Search, 
  BarChart3, 
  Brain, 
  TreePine, 
  FileText, 
  Shield, 
  User, 
  LogOut,
  Settings
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'researcher'] },
  { path: '/upload', label: 'Upload Data', icon: Upload, roles: ['admin', 'researcher'] },
  { path: '/explorer', label: 'Data Explorer', icon: Search, roles: ['admin', 'researcher', 'policy_user', 'guest'] },
  { path: '/visualize', label: 'Visualizations', icon: BarChart3, roles: ['admin', 'researcher', 'policy_user'] },
  { path: '/ai-tools', label: 'AI Tools', icon: Brain, roles: ['admin', 'researcher'] },
  { path: '/taxonomy', label: 'Taxonomy', icon: TreePine, roles: ['admin', 'researcher', 'policy_user'] },
  { path: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'researcher', 'policy_user'] },
  { path: '/admin', label: 'Admin', icon: Shield, roles: ['admin'] },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const visibleItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside 
      className={cn(
        "w-80 bg-card/80 backdrop-blur-xl border-r border-border/50 flex-shrink-0 transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl",
        collapsed && "sidebar-collapsed"
      )}
      data-testid="sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="hover-lift">
            <Logo size="md" showText={true} />
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium" data-testid="user-name">{user.name}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground capitalize" data-testid="user-role">
                    {user.role.replace('_', ' ')}
                  </span>
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2" data-testid="nav-menu">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "active text-primary bg-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <Link 
            href="/profile" 
            className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
            data-testid="nav-profile"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button 
            onClick={logout}
            className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
