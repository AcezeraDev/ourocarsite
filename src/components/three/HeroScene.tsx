import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, Sparkles, useGLTF } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

import { AO_URL, MODEL_URL } from './assets'

useGLTF.preload(MODEL_URL)

const WHEELS = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']

function Supercar({ mobile }: { mobile: boolean }) {
  const { scene } = useGLTF(MODEL_URL)
  const ao = useLoader(THREE.TextureLoader, AO_URL)
  const root = useRef<THREE.Group>(null)
  const car = useRef<THREE.Group>(null)
  const pointer = useThree((s) => s.pointer)
  const viewport = useThree((s) => s.viewport)
  const intro = useRef(0)

  const model = useMemo(() => {
    const m = scene.clone(true)
    const paint = new THREE.MeshPhysicalMaterial({
      color: '#d9a42a',
      metalness: 1,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.4,
    })
    const details = new THREE.MeshStandardMaterial({ color: '#0b0b0b', metalness: 1, roughness: 0.35 })
    const rims = new THREE.MeshStandardMaterial({ color: '#121110', metalness: 1, roughness: 0.18 })
    const glass = new THREE.MeshPhysicalMaterial({ color: '#0a0a0a', metalness: 0.25, roughness: 0, transmission: 0.6, transparent: true, opacity: 0.85 })

    const body = m.getObjectByName('body') as THREE.Mesh | undefined
    if (body) body.material = paint
    ;['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl'].forEach((n) => {
      const o = m.getObjectByName(n) as THREE.Mesh | undefined
      if (o) o.material = rims
    })
    const trim = m.getObjectByName('trim') as THREE.Mesh | undefined
    if (trim) trim.material = details
    const g = m.getObjectByName('glass') as THREE.Mesh | undefined
    if (g) g.material = glass
    return m
  }, [scene])

  const wheels = useMemo(() => WHEELS.map((n) => model.getObjectByName(n)).filter(Boolean) as THREE.Object3D[], [model])

  useEffect(() => {
    ao.colorSpace = THREE.SRGBColorSpace
  }, [ao])

  const baseX = mobile ? 0 : Math.min(viewport.width * 0.2, 2.4)
  const scale = mobile ? 0.6 : 0.92

  useFrame(({ clock }, dt) => {
    if (!root.current || !car.current) return
    const t = clock.elapsedTime
    // entrada: o carro chega deslizando da direita e freia com mola
    intro.current = Math.min(1, intro.current + dt * 0.55)
    const e = 1 - Math.pow(1 - intro.current, 4)
    const scroll = Math.min(1, window.scrollY / window.innerHeight)

    root.current.position.x = baseX + (1 - e) * 9
    root.current.position.y = (mobile ? -1.85 : -0.56) - scroll * 0.4
    const yaw = Math.PI - 0.7 + pointer.x * 0.25 + scroll * 1.6 + Math.sin(t * 0.3) * 0.05
    car.current.rotation.y = THREE.MathUtils.damp(car.current.rotation.y, yaw, 2.5, dt)

    const speed = (1 - e) * 22 + 1.2 + scroll * 8
    wheels.forEach((w) => (w.rotation.x -= speed * dt))
  })

  return (
    <group ref={root} scale={scale}>
      <group ref={car}>
        <primitive object={model} />
        <mesh rotation-x={-Math.PI / 2} position-y={0.002} renderOrder={2}>
          <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
          <meshBasicMaterial map={ao} blending={THREE.MultiplyBlending} premultipliedAlpha toneMapped={false} transparent />
        </mesh>
      </group>
      <UnderGlow />
    </group>
  )
}

/* Halo dourado no piso, como um spot de showroom. */
function UnderGlow() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
      <planeGeometry args={[9, 9]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * vec2(1.0, 1.6);
            float d = length(p);
            float halo = smoothstep(0.5, 0.0, d) * 0.28;
            float ring = smoothstep(0.012, 0.0, abs(d - (0.18 + fract(uTime * 0.18) * 0.32))) * (1.0 - fract(uTime * 0.18));
            vec3 gold = vec3(0.96, 0.72, 0.18);
            gl_FragColor = vec4(gold * (halo + ring * 0.9), 1.0);
          }
        `}
      />
    </mesh>
  )
}

function LightTrails({ count = 90 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: THREE.MathUtils.randFloat(-14, 14),
        y: THREE.MathUtils.randFloat(-0.4, 3.4),
        z: THREE.MathUtils.randFloat(-10, -2.5),
        len: THREE.MathUtils.randFloat(0.6, 3.4),
        speed: THREE.MathUtils.randFloat(6, 18),
      })),
    [count],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, dt) => {
    if (!mesh.current) return
    data.forEach((d, i) => {
      d.x -= d.speed * dt
      if (d.x < -16) d.x = 16
      dummy.position.set(d.x, d.y, d.z)
      dummy.scale.set(d.len, 1, 1)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 0.012, 0.012]} />
      <meshBasicMaterial color="#f5a300" toneMapped={false} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

/* Barras de luz no fundo, lembrando as luminárias do showroom real. */
function LightBars() {
  return (
    <group position={[0, 2.6, -6]}>
      {[-5, -1.6, 1.8, 5.2].map((x, i) => (
        <mesh key={i} position={[x, i % 2 ? 0.25 : 0, 0]}>
          <boxGeometry args={[2.2, 0.035, 0.035]} />
          <meshBasicMaterial color="#ffe9a6" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Floor({ mobile }: { mobile: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, mobile ? -1.86 : -0.565, 0]}>
      <planeGeometry args={[60, 30]} />
      {mobile ? (
        <meshStandardMaterial color="#070605" metalness={0.8} roughness={0.35} transparent opacity={0.9} />
      ) : (
        <MeshReflectorMaterial
          blur={[300, 60]}
          resolution={1024}
          mixBlur={1}
          mixStrength={30}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0b0a08"
          metalness={0.7}
          transparent
          opacity={0.95}
        />
      )}
    </mesh>
  )
}

function Rig() {
  const camera = useThree((s) => s.camera)
  const pointer = useThree((s) => s.pointer)
  useFrame((_, dt) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.5, 2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.2 + pointer.y * 0.25, 2, dt)
    camera.lookAt(0, 0.35, 0)
  })
  return null
}

function Studio() {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={['#050505']} />
      <Lightformer form="rect" intensity={6} color="#fff6e0" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 3, -6]} scale={[12, 1, 1]} />
      <Lightformer form="rect" intensity={4} color="#f6d846" position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[10, 0.8, 1]} />
      <Lightformer form="rect" intensity={4} color="#f5a300" position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[10, 0.8, 1]} />
      <Lightformer form="ring" intensity={5} color="#ffffff" position={[3, 3, 6]} scale={3} />
    </Environment>
  )
}

export default function HeroScene({ mobile, active }: { mobile: boolean; active: boolean }) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 1.2, mobile ? 8.8 : 9], fov: mobile ? 44 : 32 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}
      frameloop={active ? 'always' : 'never'}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#050505', 9, 24]} />
      <Rig />
      <ambientLight intensity={0.15} />
      <spotLight position={[3, 7, 4]} angle={0.45} penumbra={1} intensity={80} color="#fff2cc" />
      <Suspense fallback={null}>
        <Studio />
        <Supercar mobile={mobile} />
      </Suspense>
      <LightBars />
      <LightTrails count={mobile ? 40 : 90} />
      <Sparkles count={mobile ? 40 : 110} scale={[14, 5, 6]} position={[0, 1.4, -1.5]} size={2.2} speed={0.35} color="#f6d846" opacity={0.65} />
      <Floor mobile={mobile} />
      <EffectComposer multisampling={mobile ? 0 : 4}>
        <Bloom intensity={mobile ? 0.8 : 1.1} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur radius={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
