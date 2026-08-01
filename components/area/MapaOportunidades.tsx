"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

const iconePin = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type PedidoMapa = {
  id: string;
  cidade: string;
  bairro: string | null;
  valorMaximo: number;
  latitude: number;
  longitude: number;
  desbloqueado: boolean;
};

export default function MapaOportunidades({
  pedidos,
}: {
  pedidos: PedidoMapa[];
}) {
  const centro: [number, number] =
    pedidos.length > 0
      ? [pedidos[0].latitude, pedidos[0].longitude]
      : [-22.9, -46.5];

  return (
    <div className="h-[60vh] w-full overflow-hidden rounded-lg">
      <MapContainer
        center={centro}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pedidos.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={iconePin}
          >
            <Popup>
              <strong>
                {p.cidade}
                {p.bairro ? ` — ${p.bairro}` : ""}
              </strong>
              <br />
              Até R$ {p.valorMaximo.toLocaleString("pt-BR")}
              <br />
              {p.desbloqueado ? (
                <span style={{ color: "#DAA520" }}>Já desbloqueado</span>
              ) : (
                <Link href="/area-corretor">Ver em Oportunidades →</Link>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}