"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type TipoConta = "cliente" | "corretor";

const TipoContaContext = createContext<{
  tipoConta: TipoConta;
  setTipoConta: (t: TipoConta) => void;
} | null>(null);

export function TipoContaProvider({ children }: { children: ReactNode }) {
  const [tipoConta, setTipoConta] = useState<TipoConta>("cliente");
  return (
    <TipoContaContext.Provider value={{ tipoConta, setTipoConta }}>
      {children}
    </TipoContaContext.Provider>
  );
}

export function useTipoConta() {
  const contexto = useContext(TipoContaContext);
  if (!contexto) {
    throw new Error("useTipoConta precisa estar dentro de TipoContaProvider");
  }
  return contexto;
}