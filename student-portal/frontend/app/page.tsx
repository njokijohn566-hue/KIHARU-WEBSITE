export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to StudentPort 🎓</h1>
      <p className="text-gray-600 mb-8">A modern student portal for managing your academic life</p>
      <div className="flex gap-4 justify-center">
        <a href="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Login
        </a>
        <a href="/register" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
          Register
        </a>
      </div>
    </div>
  );
}
