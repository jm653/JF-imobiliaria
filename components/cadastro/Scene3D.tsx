"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const waypointsCamera: { p: number; pos: [number, number, number] }[] = [
  { p: 0.0, pos: [0, 0.5, 14] },
  { p: 0.1, pos: [2, 1, 10] },
  { p: 0.2, pos: [-2, 0.2, 8] },
  { p: 0.3, pos: [0, 0, 3.2] },
  { p: 0.4, pos: [1.6, 0.6, 5] },
  { p: 0.5, pos: [-2.5, 1, 7] },
  { p: 0.6, pos: [0, 2.2, 9] },
  { p: 0.7, pos: [2, -1, 6.5] },
  { p: 0.8, pos: [-2, 1.5, 7.5] },
  { p: 0.9, pos: [0, 1, 10] },
  { p: 1.0, pos: [0, 0, 13] },
];

function aleatorioEstavel(indice: number, sal: number) {
  const valor = Math.sin(indice * 9301 + sal * 49297) * 233280;
  return valor - Math.floor(valor);
}

function CameraRig({ reduzMovimento }: { reduzMovimento: boolean }) {
  const { camera } = useThree();
  const camState = useRef({ x: 0, y: 0.5, z: 14 });

  useEffect(() => {
    if (reduzMovimento) return;

    const contexto = gsap.context(() => {
      const linhaDoTempo = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        onUpdate: () => invalidate(),
      });

      for (let i = 1; i < waypointsCamera.length; i++) {
        const anterior = waypointsCamera[i - 1];
        const atual = waypointsCamera[i];
        linhaDoTempo.to(
          camState.current,
          {
            x: atual.pos[0],
            y: atual.pos[1],
            z: atual.pos[2],
            duration: atual.p - anterior.p,
            ease: "none",
          },
          anterior.p
        );
      }
    });

    return () => contexto.revert();
  }, [reduzMovimento]);

  useFrame(() => {
    camera.position.set(
      camState.current.x,
      camState.current.y,
      camState.current.z
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Skyline() {
  const pilares = useMemo(() => {
    const total = 12;
    const itens: { posicao: [number, number, number]; altura: number }[] = [];
    for (let i = 0; i < total; i++) {
      const angulo = (i / total) * Math.PI * 2;
      const raio = 9 + aleatorioEstavel(i, 1) * 3;
      const altura = 2 + aleatorioEstavel(i, 2) * 5;
      itens.push({
        posicao: [
          Math.cos(angulo) * raio,
          -altura / 2 - 1.5,
          Math.sin(angulo) * raio,
        ],
        altura,
      });
    }
    return itens;
  }, []);

  return (
    <group>
      {pilares.map((pilar, i) => (
        <mesh key={i} position={pilar.posicao}>
          <boxGeometry args={[0.25, pilar.altura, 0.25]} />
          <meshStandardMaterial
            color="#DAA520"
            emissive="#DAA520"
            emissiveIntensity={0.5}
            transparent
            opacity={0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function RedeNeural({ reduzMovimento }: { reduzMovimento: boolean }) {
  const grupoRef = useRef<THREE.Group>(null);
  const nucleoRef = useRef<THREE.Mesh>(null);
  const mouseAlvo = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function aoMoverMouse(e: PointerEvent) {
      mouseAlvo.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      if (!reduzMovimento) invalidate();
    }
    function aoRolar() {
      invalidate();
    }
    window.addEventListener("pointermove", aoMoverMouse);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("pointermove", aoMoverMouse);
      window.removeEventListener("scroll", aoRolar);
    };
  }, [reduzMovimento]);

  const posicoesPontos = useMemo(() => {
    const total = 90;
    const posicoes = new Float32Array(total * 3);
    for (let i = 0; i < total; i++) {
      const raio = 5 + aleatorioEstavel(i, 3) * 4;
      const theta = aleatorioEstavel(i, 4) * Math.PI * 2;
      const phi = Math.acos(aleatorioEstavel(i, 5) * 2 - 1);
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
        if (distancia < 2.1 && aleatorioEstavel(i * totalPontos + j, 6) > 0.92) {
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

  useFrame(() => {
    const alturaTotal =
      document.documentElement.scrollHeight - window.innerHeight;
    const progresso =
      alturaTotal > 0 ? Math.min(window.scrollY / alturaTotal, 1) : 0;

    if (grupoRef.current && !reduzMovimento) {
      grupoRef.current.rotation.y = mouseAlvo.current.x * 0.3;
      grupoRef.current.rotation.x = -mouseAlvo.current.y * 0.15;
    }

    if (nucleoRef.current) {
      const escala = 0.5 + progresso * 1.6;
      nucleoRef.current.scale.setScalar(escala);
      const material = nucleoRef.current
        .material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + progresso * 3.5;
    }
  });

  return (
    <group ref={grupoRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[posicoesPontos, 3]}
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
  const reduzMovimento =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="fixed inset-0 -z-10 bg-[#050817]">
      <Canvas
        camera={{ position: [0, 0.5, 14], fov: 50 }}
        dpr={1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop="demand"
      >
        <ambientLight intensity={0.2} />
        <Skyline />
        <RedeNeural reduzMovimento={reduzMovimento} />
        <CameraRig reduzMovimento={reduzMovimento} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            intensity={0.9}
            height={160}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
