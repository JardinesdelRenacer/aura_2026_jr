import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-blue-50">
      <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-xl shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm">
        Entrar al Sistema
      </Link>
    </main> 
  );
}