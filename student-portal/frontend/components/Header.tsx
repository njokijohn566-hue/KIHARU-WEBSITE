import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Student Portal</h2>
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
