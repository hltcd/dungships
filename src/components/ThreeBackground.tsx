"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.cjs";
import { usePathname } from "next/navigation";

export default function ThreeBackground() {
  const pathname = usePathname();
  // Check if it's a lesson page: /courses/[slug]/[lesson]
  // path usually starts with / -> ["", "courses", "slug", "lesson"] -> length 4
  const isLessonPage = pathname?.startsWith('/courses/') && pathname.split('/').length >= 4;

  if (isLessonPage) return null;

  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/15 rounded-full blur-[160px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-sky-600/10 rounded-full blur-[160px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
          {/* subtle dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-[#0b0b10]/40"></div>
      </div>
      <div className="fixed inset-0 z-[-1] opacity-70 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars />
        </Canvas>
      </div>
    </>
  );
}

function Stars() {
  const ref = useRef<any>(null);
  // Use as any to bypass TypedArray mismatch in earlier maath versions/TS types
  const sphere = useMemo(() => random.inSphere(new Float32Array(3000 * 3), { radius: 1.5 }) as any, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}
