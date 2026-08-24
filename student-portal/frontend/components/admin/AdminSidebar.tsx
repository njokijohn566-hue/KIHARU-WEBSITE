'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  CreditCard,
  LogOut,
} from 'lucide-react';

import { useAuthStore } from '@/utils/authStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Students',
      href: '/admin/students',
      icon: Users,
    },
    {
      label: 'Courses',
      href: '/admin/courses',
      icon: BookOpen,
    },
    {
      label: 'Enrollments',
      href: '/admin/enrollments',
      icon: ClipboardList,
    },
    {
      label: 'Grades',
      href: '/admin/grades',
      icon: GraduationCap,
    },
    {
      label: 'Fees & Payments',
      href: '/admin/fees',
      icon: CreditCard,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white">
      <div className="flex h-full flex-col">

        {/* Brand */}
        <div className="border-b border-gray-800 px-6 py-6">
          <h1 className="text-xl font-bold">
            Kiharu TVC
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Administration Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </Link>
            );
          })}

        </nav>

        {/* Logout */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-red-600 hover:text-white"
          >
            <LogOut size={20} />

            <span>Logout</span>
          </button>
        </div>

      </div>
    </aside>
  );
}