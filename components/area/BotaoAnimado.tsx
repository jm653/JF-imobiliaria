"use client";

import Link from "next/link";
import { ReactNode } from "react";

function Seta({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
    </svg>
  );
}

export default function BotaoAnimado({
  href,
  externo = false,
  onClick,
  children,
  tipo = "link",
  disabled = false,
}: {
  href?: string;
  externo?: boolean;
  onClick?: () => void;
  children: ReactNode;
  tipo?: "link" | "button";
  disabled?: boolean;
}) {
  const conteudo = (
    <>
      <Seta className="botao-animado-seta botao-animado-seta-2" />
      <span className="botao-animado-texto">{children}</span>
      <span className="botao-animado-circulo" />
      <Seta className="botao-animado-seta botao-animado-seta-1" />
    </>
  );

  if (tipo === "button") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="botao-animado disabled:cursor-not-allowed disabled:opacity-50"
      >
        {conteudo}
      </button>
    );
  }

  if (externo) {
    return (
      <a
        href={href ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="botao-animado"
      >
        {conteudo}
      </a>
    );
  }

  return (
    <Link href={href ?? "#"} className="botao-animado">
      {conteudo}
    </Link>
  );
}