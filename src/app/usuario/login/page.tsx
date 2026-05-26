"use client";

import { setMockSession } from "@/lib/mock-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const MOCK_EMAIL = "admin@cadaspatas.com";
const MOCK_PASSWORD = "123456";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      setMockSession({ email, name: "Admin" });
      router.push("/home");
      router.refresh();
      return;
    }

    setError("Email ou senha invalidos.");
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FFF9F7] p-6">
      <div className="w-full max-w-md rounded-2xl border-2 border-[#3A250B]/[30%] bg-white/90 p-6 shadow-md backdrop-blur">
        <div className="mb-6 flex flex-col items-center gap-2" aria-label="icone">
          <Image width={72} height={72} src="/images/icone.svg" alt="Icone CadasPatas" />
          <h1 className="text-2xl font-bold text-[#3A250B]">CadasPatas</h1>
          <p className="text-sm text-[#3A250B]/70">Entre na sua conta</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div aria-label="email" className="flex items-center gap-2 rounded border border-[#3A250B]/20 px-3 py-2">
            <Image src="/images/email.svg" width={16} height={16} alt="icone de email" />
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="w-full bg-transparent text-sm outline-none"
              required
            />
          </div>

          <div aria-label="senha" className="space-y-1">
            <div className="flex items-center gap-2 rounded border border-[#3A250B]/20 px-3 py-2">
              <Image src="/images/senha.svg" width={16} height={16} alt="icone de senha" />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                className="w-full bg-transparent text-sm outline-none"
                required
              />
            </div>
            <a className="block text-right text-xs text-[#3A250B]/70">Esqueceu a senha?</a>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded bg-[#3A250B] p-2 text-white transition hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#3A250B]/70">
          Mock login: admin@cadaspatas.com / 123456
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/background-login.png')] bg-bottom bg-no-repeat bg-size-[100%_auto]"
        aria-hidden
      />
    </div>
  );
}
