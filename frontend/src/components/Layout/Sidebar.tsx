import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LinkedinIcon, 
  Megaphone, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  BarChart2, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: LinkedinIcon, label: 'LinkedIn Outreach', path: '/linkedin-outreach' },
  { icon: Megaphone, label: 'Campaigns', path: '/campaigns' },
  { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
  { icon: MessageSquare, label: 'Chat with Zoe', path: '/chat' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside 
      className={clsx(
        'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {isOpen && (
          <h1 className="text-xl font-semibold text-gray-900">Cognifuse AI</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="mt-6 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100',
                !isOpen && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 