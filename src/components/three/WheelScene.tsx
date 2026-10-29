import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, RoundedBox, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODEL_URL } from './assets'

/*
  Roda real do modelo do hero (wheel_fl): aro, raios, disco de freio,
  porcas e pneu. O emblema central original é trocado pelo logo da Ourocar.
  O eixo de giro do nó é X; giramos o grupo para a face externa olhar a câmera.
*/
function Wheel({ progress }: { progress: React.RefObject<number> }) {
  const { scene } = useGLTF(MODEL_URL)
  const logo = useLoader(THREE.TextureLoader, '/ourocar/logo.jpg')
  const spin = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)

  const wheel = useMemo(() => {
    const src = scene.getObjectByName('wheel_fl')
    if (!src) return null
    const w = src.clone(true)
    w.position.set(0, 0, 0)
    w.rotation.set(0, 0, 0)

    const gold = new THREE.MeshPhysicalMaterial({
      color: '#e2ad35',
      metalness: 1,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.1,
    })
    const goldBrushed = new THREE.MeshPhysicalMaterial({ color: '#b98a22', metalness: 1, roughness: 0.38, envMapIntensity: 1.3 })
    const disc = new THREE.MeshStandardMaterial({ color: '#5a5650', metalness: 0.95, roughness: 0.42 })
    const nuts = new THREE.MeshStandardMaterial({ color: '#0d0d0d', metalness: 1, roughness: 0.2 })
    const tire = new THREE.MeshPhysicalMaterial({ color: '#161616', metalness: 0, roughness: 0.7, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color('#6b5a3a') })

    const set = (name: string, m: THREE.Material) => {
      const o = w.getObjectByName(name) as THREE.Mesh | undefined
      if (o) o.material = m
    }
    set('rim_fl', gold)
    set('wheel_2', goldBrushed)
    set('brake_2', disc)
    set('nuts_2', nuts)
    set('tire_2', tire)
    const centre = w.getObjectByName('centre_2')
    if (centre) centre.visible = false
    return w
  }, [scene])

  const capMat = useMemo(() => {
    logo.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshPhysicalMaterial({ map: logo, emissiveMap: logo, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.6, metalness: 0.2, roughness: 0.25, clearcoat: 1 })
  }, [logo])

  useFrame(({ clock }, dt) => {
    const p = progress.current ?? 0
    if (spin.current) spin.current.rotation.x = -p * Math.PI * 5 - clock.elapsedTime * 0.35
    if (tilt.current) tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, Math.PI / 2 - 0.5 + p * 0.7, 3, dt)
  })

  if (!wheel) return null

  return (
    <group scale={3.9}>
      <group ref={tilt} rotation={[0.06, Math.PI / 2 - 0.5, 0]}>
        <group ref={spin}>
          <primitive object={wheel} />
          {/* calota com o logo da Ourocar (gira junto) */}
          <mesh position={[-0.112, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={capMat}>
            <circleGeometry args={[0.046, 48]} />
          </mesh>
          <mesh position={[-0.111, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.047, 0.005, 12, 48]} />
            <meshStandardMaterial color="#e2ad35" metalness={1} roughness={0.15} />
          </mesh>
        </group>
        {/* pinça de freio fixa, entre o disco e os raios */}
        <group rotation={[-0.75, 0, 0]}>
          <RoundedBox args={[0.045, 0.12, 0.08]} radius={0.015} smoothness={4} position={[-0.04, 0.17, 0]}>
            <meshPhysicalMaterial color="#f5a300" metalness={0.3} roughness={0.28} clearcoat={1} />
          </RoundedBox>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URL)

export default function WheelScene({ progress, active, mobile }: { progress: React.RefObject<number>; active: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 5.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
      frameloop={active ? 'always' : 'never'}
    >
      <ambientLight intensity={0.2} />
      <spotLight position={[3, 5, 6]} angle={0.5} penumbra={1} intensity={45} color="#fff2c8" />
      <pointLight position={[-4, -1, 3]} intensity={25} color="#f5a300" />
      <pointLight position={[0, 0, -3]} intensity={30} color="#f6d846" />
      <Suspense fallback={null}>
        <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.35}>
          <Wheel progress={progress} />
        </Float>
        <Environment resolution={512} frames={1}>
          <Lightformer form="rect" intensity={3} color="#fff6e0" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[4, 1, 4]} rotation-y={-Math.PI / 4} scale={[3, 6, 1]} />
          <Lightformer form="rect" intensity={3} color="#f6d846" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
          <Lightformer form="ring" intensity={4} color="#f5a300" position={[-2, -3, 4]} scale={2} />
          <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
        </Environment>
      </Suspense>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.7} scale={6} blur={2.4} far={2.5} color="#000" />
    </Canvas>
  )
}
