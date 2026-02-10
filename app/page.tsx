import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-black text-white">
      <h1 className="text-5xl font-bold">QUIZBALL</h1>

      <p className="text-xl text-gray-300">Διάλεξε άθλημα για να ξεκινήσεις</p>

      <div className="flex gap-6">
        <Link href="/setup?sport=football">
          <button className="px-8 py-4 text-xl rounded-xl bg-green-600 hover:bg-green-700 transition">
            ⚽ Football
          </button>
        </Link>

        <Link href="/setup?sport=basket">
          <button className="px-8 py-4 text-xl rounded-xl bg-orange-600 hover:bg-orange-700 transition">
            🏀 Basketball
          </button>
        </Link>
      </div>
    </main>
  );
}
