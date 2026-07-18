    "use client";

import { signOut } from "next-auth/react";

export default function SairButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-6 rounded-full border border-white/20 px-5 py-2 font-body text-sm text-white/70 transition-colors hover:bg-white/5"
    >
      Sair
    </button>
  );
}