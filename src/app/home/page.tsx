"use client";

import { clearMockSession, getMockSession } from "@/lib/mock-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const session = getMockSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUserName(session.name);
  }, [router]);

  function handleLogout() {
    clearMockSession();
    router.push("/login");
    router.refresh();
  }

  if (!userName) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F7]">
        <p className="text-[#3A250B]/70">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F7] p-6">
      <div className="mx-auto max-w-3xl rounded-xl border border-[#3A250B]/20 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#3A250B]">Home</h1>
            <p className="mt-2 text-[#3A250B]/80">
              Ola, {userName}. Login mock realizado com sucesso.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded border border-[#3A250B]/30 px-4 py-2 text-sm text-[#3A250B] transition hover:bg-[#3A250B]/10"
          >
            Sair
          </button>
        </div>
      </div>
    </main>
  );
}
