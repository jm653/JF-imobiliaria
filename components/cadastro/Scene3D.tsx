"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function RedeNeural() {
  const grupoRef = useRef<THREE.Group>(null);
  const nucleoRef = useRef<THREE.Mesh>(null);
  const mouseAlvo = useRef({ x: 0, y: 0 });
  const reduzMovimento = useRef(false);

  useEffect(() => {
    reduzMovimento.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function aoMoverMouse(e: PointerEvent) {
      mouseAlvo.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    }
    window.addEventListener("pointermove", aoMoverMouse);
    return () => window.removeEventListener("pointermove", aoMoverMouse);
  }, []);

  const posicoesPontos = useMemo(() => {
    const total = 140;
    const posicoes = new Float32Array(total * 3);
    for (let i = 0; i < total; i++) {
      const raio = 5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      posicoes[i * 3] = raio * Math.sin(phi) * Math.cos(theta);
      posicoes[i * 3 + 1] = raio * Math.sin(phi) * Math.sin(theta) * 0.5;
      posicoes[i * 3 + 2] = raio * Math.cos(phi);
    }
    return posicoes;
  }, []);

  const geometriaLinhas = useMemo(() => {
    const geometria = new THREE.BufferGeometry();
    const pares: number[] = [];
    const totalPontos = posicoesPontos.length / 3;

    for (let i = 0; i < totalPontos; i++) {
      for (let j = i + 1; j < totalPontos; j++) {
        const dx = posicoesPontos[i * 3] - posicoesPontos[j * 3];
        const dy = posicoesPontos[i * 3 + 1] - posicoesPontos[j * 3 + 1];
        const dz = posicoesPontos[i * 3 + 2] - posicoesPontos[j * 3 + 2];
        const distancia = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distancia < 2.1 && Math.random() > 0.88) {
          pares.push(
            posicoesPontos[i * 3],
            posicoesPontos[i * 3 + 1],
            posicoesPontos[i * 3 + 2],
            posicoesPontos[j * 3],
            posicoesPontos[j * 3 + 1],
            posicoesPontos[j * 3 + 2]
          );
        }
      }
    }

    geometria.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pares, 3)
    );
    return geometria;
  }, [posicoesPontos]);

  useFrame((state) => {
    const alturaTotal =
      document.documentElement.scrollHeight - window.innerHeight;
    const progresso =
      alturaTotal > 0 ? Math.min(window.scrollY / alturaTotal, 1) : 0;

    if (grupoRef.current && !reduzMovimento.current) {
      grupoRef.current.rotation.y += 0.0008;
      grupoRef.current.rotation.y +=
        (mouseAlvo.current.x * 0.4 - grupoRef.current.rotation.y * 0.05) *
        0.03;
      grupoRef.current.rotation.x +=
        (-mouseAlvo.current.y * 0.2 - grupoRef.current.rotation.x) * 0.03;
    }

    if (nucleoRef.current) {
      const pulso = reduzMovimento.current
        ? 0
        : Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
      const escala = 0.5 + progresso * 1.6 + pulso;
      nucleoRef.current.scale.setScalar(escala);
      const material = nucleoRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + progresso * 3.5;
    }
  });

  return (
    <group ref={grupoRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={posicoesPontos.length / 3}
            array={posicoesPontos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#DAA520"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      <lineSegments geometry={geometriaLinhas}>
        <lineBasicMaterial color="#DAA520" transparent opacity={0.15} />
      </lineSegments>

      <mesh ref={nucleoRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#DAA520"
          emissive="#DAA520"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      <pointLight color="#DAA520" intensity={3} distance={12} />
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050817]">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <RedeNeural />
      </Canvas>
    </div>
  );
}