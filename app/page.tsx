import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-blue-50">
      <Link href="/proyectar" className="bg-blue-500 text-white px-6 py-3 rounded">Entrar al Dashboard</Link>
    </main> 
  );
}