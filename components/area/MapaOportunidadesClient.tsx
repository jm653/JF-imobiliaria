"use client";

import dynamic from "next/dynamic";

type PedidoMapa = {
  id: string;
  cidade: string;
  bairro: string | null;
  valorMaximo: number;
  latitude: number;
  longitude: number;
  desbloqueado: boolean;
};

const MapaOportunidades = dynamic(() => import("./MapaOportunidades"), {
  ssr: false,
});

export default function MapaOportunidadesClient({
  pedidos,
}: {
  pedidos: PedidoMapa[];
}) {
  return <MapaOportunidades pedidos={pedidos} />;
}
