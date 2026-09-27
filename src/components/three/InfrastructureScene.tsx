"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ProgressStore } from "@/lib/scrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
function stage(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start));
}
function smoothstep(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

const ROAD_HALF_WIDTH = 8;
const RPM_COUNT = 16;
const DASH_COUNT = 14;

// Directional road-sign artwork (cropped from the supplied reference sheet,
// transparent PNGs — diamond shape only, no rod through the middle).
const SIGN_IMAGES = {
  straight: "/images/signs/straight.png",
  rightTurn: "/images/signs/right-turn.png",
  leftTurn: "/images/signs/left-turn.png",
  uTurn: "/images/signs/u-turn.png",
  fork: "/images/signs/fork.png",
  twoWay: "/images/signs/two-way.png",
} as const;
type SignImageKey = keyof typeof SIGN_IMAGES;
// width / height of each source crop, used to keep the sign's proportions correct
const SIGN_ASPECT: Record<SignImageKey, number> = {
  straight: 185 / 194,
  rightTurn: 198 / 194,
  leftTurn: 186 / 194,
  uTurn: 185 / 195,
  fork: 198 / 195,
  twoWay: 186 / 195,
};

export default function InfrastructureScene({
  progressRef,
  reducedMotion,
  tier,
}: {
  progressRef: ProgressStore;
  reducedMotion: boolean;
  tier: "full" | "lite";
}) {
  const isFull = tier === "full";
  const { camera } = useThree();
  const smoothed = useRef(0);
  const time = useRef(0);

  const signTextures = useTexture(SIGN_IMAGES);
  useMemo(() => {
    Object.values(signTextures).forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
    });
  }, [signTextures]);

  const roadLineRef = useRef<THREE.Mesh>(null);
  const gantryRef = useRef<THREE.Group>(null);
  const ledMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ledPointRef = useRef<THREE.PointLight>(null);
  const signRef = useRef<THREE.Group>(null);
  const cctvRef = useRef<THREE.Group>(null);
  const cctvHeadRef = useRef<THREE.Group>(null);
  const statusLedRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const fogRef = useRef<THREE.FogExp2>(null);
  const rpmRefs = useRef<(THREE.Mesh | null)[]>([]);
  const warnSignRefs = useRef<(THREE.Group | null)[]>([]);

  // Reflective road studs (RPMs) — amber/orange, both sides of the centre line
  const rpms = useMemo(
    () =>
      Array.from({ length: RPM_COUNT }, (_, i) => ({
        z: 2 - i * 3.2,
        start: 0.6 + i * 0.012,
      })),
    []
  );

  // Painted white lane dashes, lying flat on the road surface (both sides).
  // Visible right from the start of the scroll — no scroll-triggered reveal.
  const dashes = useMemo(() => {
    const items: { x: number; z: number }[] = [];
    for (let i = 0; i < DASH_COUNT; i++) {
      const z = 4 - i * 4.2;
      items.push({ x: -3.6, z });
      items.push({ x: 3.6, z });
    }
    return items;
  }, []);

  // Directional road signs — two rows of 3, mounted on the left and right
  // shoulders (mirrored pairs at the same distance down the road), each with
  // a little gap between the boards on its own side. Past the CCTV pole.
  const warningSigns = useMemo(() => {
    const pairs = [
      { z: -42, start: 0.58, left: "straight", right: "uTurn" },
      { z: -48, start: 0.68, left: "rightTurn", right: "fork" },
      { z: -54, start: 0.78, left: "leftTurn", right: "twoWay" },
    ] satisfies { z: number; start: number; left: SignImageKey; right: SignImageKey }[];

    return pairs.flatMap((pair) => [
      { x: -7.6, z: pair.z, start: pair.start, key: pair.left },
      { x: 7.6, z: pair.z, start: pair.start, key: pair.right },
    ]);
  }, []);

  useFrame((_, delta) => {
    time.current += delta;
    const target = progressRef.value;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 4, delta);
    const p = smoothed.current;

    // Camera travels straight down the centre of the highway — no lateral drift.
    const camZ = THREE.MathUtils.lerp(15, -46, p);
    const camY = THREE.MathUtils.lerp(3.4, 2.6, p);
    camera.position.set(0, camY, camZ);
    camera.lookAt(0, 1.2, camZ - 18);

    // Centre line glows in
    if (roadLineRef.current) {
      const mat = roadLineRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(0, 0.5, stage(p, 0.0, 0.16));
    }

    // Gantry rises from below the road
    if (gantryRef.current) {
      const s = stage(p, 0.26, 0.46);
      gantryRef.current.position.y = THREE.MathUtils.lerp(-11, 0, s);
    }

    // LED billboard activates
    const ledStage = stage(p, 0.44, 0.58);
    if (ledMatRef.current) {
      ledMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(0, 2.6, ledStage);
    }
    if (ledPointRef.current) {
      ledPointRef.current.intensity = THREE.MathUtils.lerp(0, 6, ledStage);
    }

    // Roadside sign board rises from the ground
    if (signRef.current) {
      const s = stage(p, 0.12, 0.3);
      signRef.current.position.y = THREE.MathUtils.lerp(-7, 0, s);
    }

    // CCTV pole rises, then the head pans toward the viewer
    if (cctvRef.current) {
      const s = stage(p, 0.5, 0.64);
      cctvRef.current.position.y = THREE.MathUtils.lerp(-8, 0, s);
    }
    if (cctvHeadRef.current) {
      const s = stage(p, 0.62, 0.76);
      const panBase = THREE.MathUtils.lerp(-1.3, -0.25, s);
      // Once the head has swung into view, keep it sweeping side to side
      // like a live, moving surveillance camera scanning the highway.
      const sweep = reducedMotion ? 0 : Math.sin(time.current * 0.7) * 0.5 * s;
      cctvHeadRef.current.rotation.y = panBase + sweep;
      cctvHeadRef.current.rotation.x = reducedMotion
        ? 0
        : Math.sin(time.current * 0.45) * 0.08 * s;
    }
    if (statusLedRef.current) {
      const s = stage(p, 0.62, 0.76);
      const mat = statusLedRef.current.material as THREE.MeshStandardMaterial;
      const blink = reducedMotion ? 1 : (Math.sin(time.current * 4) + 1) / 2;
      mat.emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.4, blink) * s;
    }
    if (beamRef.current) {
      const s = stage(p, 0.64, 0.78);
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity =
        THREE.MathUtils.lerp(0, 0.14, s) *
        (reducedMotion ? 1 : 0.85 + 0.15 * Math.sin(time.current * 2));
    }

    // Directional road signs: rise smoothly into place and stay up —
    // they do not drop back down once revealed.
    warningSigns.forEach((sign, i) => {
      const group = warnSignRefs.current[i];
      if (!group) return;
      const s = smoothstep(stage(p, sign.start, sign.start + 0.08));
      group.position.y = THREE.MathUtils.lerp(-2.4, 0, s);
    });

    // RPMs illuminate sequentially
    rpms.forEach((rpm, i) => {
      const mesh = rpmRefs.current[i];
      if (!mesh) return;
      const s = stage(p, rpm.start, rpm.start + 0.05);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(0, 2.6, s);
    });

    if (fogRef.current) {
      fogRef.current.density = THREE.MathUtils.lerp(0.018, 0.026, p);
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={["#0f1b14", 0.02]} />
      <color attach="background" args={["#0f1b14"]} />

      {/* On "lite" devices, skip the HDRI environment map (a network fetch
          plus a fairly heavy image-based-lighting pass) and compensate with
          a touch more ambient/directional light so materials don't look
          flat without it. */}
      <ambientLight intensity={isFull ? 0.35 : 0.5} color="#a7c2b2" />
      <directionalLight position={[10, 18, -8]} intensity={isFull ? 1.1 : 1.3} color="#ffb27a" />
      <directionalLight position={[-12, 6, 10]} intensity={0.4} color="#1f8bff" />

      {isFull && <Environment preset="city" environmentIntensity={0.35} />}

      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -30]} receiveShadow>
        <planeGeometry args={[ROAD_HALF_WIDTH * 2, 140]} />
        <meshStandardMaterial color="#0f1a14" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Solid white centre line */}
      <mesh ref={roadLineRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -30]}>
        <planeGeometry args={[0.22, 130]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0}
          roughness={0.4}
        />
      </mesh>

      {/* White dashed lane markings, flat on the road — visible immediately,
          right from the start of the scroll */}
      {dashes.map((dash, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[dash.x, 0.018, dash.z]}>
          <planeGeometry args={[0.2, 2.6]} />
          <meshStandardMaterial color="#f2f5f7" roughness={0.45} />
        </mesh>
      ))}

      {/* Reflective road studs (RPMs) — amber, both sides of centre */}
      {rpms.map((rpm, i) => (
        <group key={i}>
          <mesh
            ref={(el) => {
              rpmRefs.current[i] = el;
            }}
            position={[7.2, 0.05, rpm.z]}
          >
            <boxGeometry args={[0.16, 0.05, 0.16]} />
            <meshStandardMaterial
              color="#ff6a13"
              emissive="#ff6a13"
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-7.2, 0.05, rpm.z]}>
            <boxGeometry args={[0.16, 0.05, 0.16]} />
            <meshStandardMaterial
              color="#ff6a13"
              emissive="#ff6a13"
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Gantry — legs stand clear of the carriageway. Placed well past the
          roadside signage pole so the two structures read as distinct,
          separated landmarks along the highway. */}
      <group ref={gantryRef} position={[0, -11, -28]}>
        <mesh position={[-8.6, 3.2, 0]}>
          <boxGeometry args={[0.4, 6.4, 0.4]} />
          <meshStandardMaterial color="#5a6169" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[8.6, 3.2, 0]}>
          <boxGeometry args={[0.4, 6.4, 0.4]} />
          <meshStandardMaterial color="#5a6169" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* Base plates */}
        <mesh position={[-8.6, 0.12, 0]}>
          <boxGeometry args={[0.9, 0.24, 0.9]} />
          <meshStandardMaterial color="#464c52" metalness={0.7} roughness={0.5} />
        </mesh>
        <mesh position={[8.6, 0.12, 0]}>
          <boxGeometry args={[0.9, 0.24, 0.9]} />
          <meshStandardMaterial color="#464c52" metalness={0.7} roughness={0.5} />
        </mesh>
        <mesh position={[0, 6.4, 0]}>
          <boxGeometry args={[17.6, 0.42, 0.42]} />
          <meshStandardMaterial color="#6a7178" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* LED billboard mounted on the gantry — dark professional cabinet
            with a brand-green glow, instead of a flat blue rectangle. */}
        <group position={[0, 5.5, 0.35]}>
          <mesh>
            <boxGeometry args={[6.4, 2.6, 0.15]} />
            <meshStandardMaterial color="#0d0f11" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <planeGeometry args={[6, 2.2]} />
            <meshStandardMaterial
              ref={ledMatRef}
              color="#0a1210"
              emissive="#2fdb8f"
              emissiveIntensity={0}
              toneMapped={false}
            />
          </mesh>
          <Text
            position={[0, 0, 0.16]}
            fontSize={0.52}
            color="#3fe6a0"
            font="/fonts/inter-800.woff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.05}
          >
            DAYA ENTERPRISES
          </Text>
          <pointLight
            ref={ledPointRef}
            position={[0, 0, 2]}
            color="#2fdb8f"
            intensity={0}
            distance={12}
          />
        </group>
      </group>

      {/* Roadside highway sign board on an L-shaped cantilever post */}
      <group ref={signRef} position={[0, -7, 0]}>
        <group position={[7.4, 0, -16]}>
          {/* Post from the ground up */}
          <mesh position={[0, 2.6, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 5.2, 16]} />
            <meshStandardMaterial color="#7b8288" metalness={0.75} roughness={0.4} />
          </mesh>
          {/* Foundation plate */}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.6, 0.28, 0.6]} />
            <meshStandardMaterial color="#5c6268" metalness={0.6} roughness={0.55} />
          </mesh>
          {/* Cantilever arm reaching over the shoulder */}
          <mesh position={[-1.5, 5.1, 0]}>
            <boxGeometry args={[3.1, 0.16, 0.16]} />
            <meshStandardMaterial color="#7b8288" metalness={0.75} roughness={0.4} />
          </mesh>
          {/* Green sign panel with white border */}
          <group position={[-2.9, 4.62, 0]}>
            <mesh>
              <boxGeometry args={[3.9, 1.15, 0.08]} />
              <meshStandardMaterial color="#f2f5f7" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[3.62, 0.9]} />
              <meshStandardMaterial color="#2f6f4a" roughness={0.65} />
            </mesh>
            <Text
              position={[0, 0, 0.09]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.04}
            >
              PUNE
            </Text>
          </group>
        </group>
      </group>

      {/* CCTV on a grounded roadside pole */}
      <group ref={cctvRef} position={[0, -8, 0]}>
        <group position={[-7.2, 0, -38]}>
          <mesh position={[0, 2.9, 0]}>
            <cylinderGeometry args={[0.11, 0.14, 5.8, 16]} />
            <meshStandardMaterial color="#3d4247" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.55, 0.28, 0.55]} />
            <meshStandardMaterial color="#4a5158" metalness={0.6} roughness={0.55} />
          </mesh>
          {/* Short arm at the top */}
          <mesh position={[0.35, 5.7, 0]}>
            <boxGeometry args={[0.7, 0.1, 0.1]} />
            <meshStandardMaterial color="#3d4247" metalness={0.7} roughness={0.4} />
          </mesh>

          <group ref={cctvHeadRef} position={[0.7, 5.55, 0]}>
            {/* Mounting knuckle joint */}
            <mesh position={[0, 0, 0.07]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#2c2f33" metalness={0.7} roughness={0.35} />
            </mesh>
            {/* Camera body — tapered bullet housing */}
            <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.17, 0.6, 24]} />
              <meshStandardMaterial color="#e9ebee" metalness={0.55} roughness={0.28} />
            </mesh>
            {/* Rear cable-gland cap */}
            <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.05, 24]} />
              <meshStandardMaterial color="#3a3f44" metalness={0.5} roughness={0.4} />
            </mesh>
            {/* Front housing ring */}
            <mesh position={[0, 0, 0.655]}>
              <cylinderGeometry args={[0.155, 0.155, 0.03, 24]} />
              <meshStandardMaterial color="#c8cbcf" metalness={0.6} roughness={0.25} />
            </mesh>
            {/* Sun-shade hood shielding the lens */}
            <mesh position={[0, 0.085, 0.58]} rotation={[0.35, 0, 0]}>
              <cylinderGeometry args={[0.185, 0.185, 0.16, 20, 1, true, 0, Math.PI]} />
              <meshStandardMaterial color="#d7dade" metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            {/* Lens glass — dark with a faint blue reflection */}
            <mesh position={[0, 0, 0.685]}>
              <cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />
              <meshStandardMaterial
                color="#050608"
                metalness={0.9}
                roughness={0.05}
                emissive="#1f8bff"
                emissiveIntensity={0.12}
              />
            </mesh>
            {/* IR-LED ring around the lens */}
            <mesh position={[0, 0, 0.672]}>
              <torusGeometry args={[0.1, 0.012, 8, 20]} />
              <meshStandardMaterial color="#2a0a0a" metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Recording status LED — blinks once the camera is live */}
            <mesh ref={statusLedRef} position={[0.16, 0.09, 0.5]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ff3030" emissive="#ff3030" emissiveIntensity={0} toneMapped={false} />
            </mesh>
            <mesh ref={beamRef} position={[0, 0, 4.4]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[2.4, 8.4, 32, 1, true]} />
              <meshBasicMaterial
                color="#2f9bff"
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* Directional road signs — real artwork on flat boards, mounted in
          mirrored pairs on the left and right shoulders past the CCTV pole,
          with a gap between each pair. The post stops at the bottom edge of
          the board, so it sits behind/under the sign rather than poking up
          through its middle. They rise once and stay up. */}
      {warningSigns.map((sign, i) => {
        const aspect = SIGN_ASPECT[sign.key];
        const signHeight = 1.05;
        const signWidth = signHeight * aspect;
        const postHeight = 1.55;
        const signCenterY = postHeight + signHeight / 2 + 0.03;
        return (
          <group
            key={i}
            ref={(el) => {
              warnSignRefs.current[i] = el;
            }}
            position={[sign.x, -2.4, sign.z]}
          >
            {/* Post — height stops right at the bottom of the sign board */}
            <mesh position={[0, postHeight / 2, -0.04]}>
              <cylinderGeometry args={[0.07, 0.07, postHeight, 14]} />
              <meshStandardMaterial color="#6b7278" metalness={0.7} roughness={0.45} />
            </mesh>
            {/* Base plate */}
            <mesh position={[0, 0.05, -0.04]}>
              <boxGeometry args={[0.34, 0.1, 0.34]} />
              <meshStandardMaterial color="#4a5158" metalness={0.6} roughness={0.55} />
            </mesh>
            {/* Sign board — the real artwork, flat, nothing overlapping it */}
            <mesh position={[0, signCenterY, 0]}>
              <planeGeometry args={[signWidth, signHeight]} />
              <meshStandardMaterial
                map={signTextures[sign.key]}
                transparent
                alphaTest={0.4}
                roughness={0.55}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {!reducedMotion && (
        <Sparkles
          count={isFull ? 70 : 24}
          scale={[26, 8, 90]}
          size={1.6}
          speed={0.25}
          color="#9dccff"
          opacity={0.3}
          position={[0, 4, -30]}
        />
      )}
    </>
  );
}
