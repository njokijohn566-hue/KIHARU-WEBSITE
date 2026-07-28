import { ReactNode } from 'react';
import Link from 'next/link';
import { LogOut, Home, BookOpen, DollarSign, FileText, User } from 'lucide-react';
import { useAuthStore } from '@/utils/authStore';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Grades', href: '/dashboard/grades' },
    { icon: BookOpen, label: 'Units', href: '/dashboard/units' },
    { icon: DollarSign, label: 'Fees', href: '/dashboard/fees' },
    { icon: FileText, label: 'Assignments', href: '/dashboard/assignments' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">🎓 StudentPort</h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full mt-8 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-left"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
