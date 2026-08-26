"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Camera, MapPin } from "lucide-react";

type Props = {
  id: string;
  titulo: string;
  cidade: string;
  bairro: string | null;
  valor: number;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  areaM2: number | null;
  garagem: boolean;
  fotos: string[];
};

export default function ImovelCardCliente(props: Props) {
  const [indice, setIndice] = useState(0);
  const [emHover, setEmHover] = useState(false);
  const temGaleria = props.fotos.length > 1;

  useEffect(() => {
    if (!emHover || !temGaleria) return;
    const intervalo = window.setInterval(() => {
      setIndice((atual) => (atual + 1) % props.fotos.length);
    }, 1800);
    return () => window.clearInterval(intervalo);
  }, [emHover, temGaleria, props.fotos.length]);

  return (
    <Link
      href={`/area-cliente/imoveis/${props.id}`}
      onMouseEnter={() => { setIndice(0); setEmHover(true); }}
      onMouseLeave={() => setEmHover(false)}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-white/3 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-[#DAA520]/50 hover:shadow-[0_18px_55px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-[#11131d]">
        {props.fotos.length ? props.fotos.map((foto, fotoIndice) => (
          <Image
            key={foto}
            src={foto}
            alt={fotoIndice === 0 ? props.titulo : ""}
            aria-hidden={fotoIndice !== indice}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 50vw"
            className={`object-cover transition-[opacity,transform] duration-1000 ease-out ${fotoIndice === indice ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          />
        )) : (
          <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_70%_20%,rgba(218,165,32,0.24),transparent_32%),linear-gradient(135deg,#17151b,#080914)]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Sem imagens</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex justify-between p-3">
          <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/75 backdrop-blur-md">Match IA</span>
          {props.fotos.length > 0 && <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] text-white/75 backdrop-blur-md"><Camera size={11} /> {props.fotos.length}</span>}
        </div>
        {temGaleria && <div className="absolute inset-x-3 bottom-3 flex gap-1">{props.fotos.map((foto, fotoIndice) => <span key={foto} className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${fotoIndice === indice ? "bg-[#F4C95D]" : "bg-white/35"}`} />)}</div>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold text-white">{props.titulo}</p>
            <p className="mt-1 flex items-center gap-1 font-body text-sm text-white/48"><MapPin size={13} className="text-[#DAA520]" /> {props.cidade}{props.bairro ? ` — ${props.bairro}` : ""}</p>
          </div>
          <span className="shrink-0 font-mono text-sm font-semibold text-[#F4C95D]">R$ {props.valor.toLocaleString("pt-BR")}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-3 font-body text-xs text-white/50">
          {props.quartos ? <span>{props.quartos} quartos</span> : null}
          {props.banheiros ? <span>{props.banheiros} banheiros</span> : null}
          {props.vagas ? <span>{props.vagas} vagas</span> : null}
          {props.areaM2 ? <span>{props.areaM2} m²</span> : null}
          {props.garagem && <span>Garagem</span>}
        </div>
        <span className="mt-4 inline-block font-body text-xs font-semibold text-[#F4C95D] transition-transform duration-300 group-hover:translate-x-1">Explorar imóvel →</span>
      </div>
    </Link>
  );
}
