import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Clouds, Cloud, /*CameraControls, Sky as SkyImpl*/ } from "@react-three/drei"
import type { Group } from "three"
import * as THREE from "three"

export const SkyScene: React.FC = () => {
    return (
        <Canvas camera={{ position: [0, -10, 6], fov: 75 }}>
            <Sky />
            <ambientLight intensity={Math.PI / 1.5} />
            <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={100} />
            <spotLight position={[-20, 0, 10]} color="red" angle={0.15} decay={0} penumbra={-1} intensity={30} />
            <spotLight position={[20, -10, 10]} color="red" angle={0.2} decay={0} penumbra={-1} intensity={20} />
            {/* <CameraControls /> */}
        </Canvas>
    )
}

const Sky = () => {
    const ref = useRef<Group>(null)
    const cloud0 = useRef<Group>(null)

    // Static values to replace useControls
    const config = {
        seed: 1,
        segments: 5,
        volume: 20,
        opacity: 0.8,
        fade: 10,
        growth: 4,
        speed: 0.1,
    }

    const x = 6
    const y = 1
    const z = 1
    const color = "white"

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 3) / 3
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 3) / 3
        }
        if (cloud0.current) {
            cloud0.current.rotation.y -= delta / 1000
        }
    })

    return (
        <>
            {/* <SkyImpl /> */}
            <group ref={ref}>
                <Clouds material={THREE.MeshLambertMaterial} limit={400} range={80}>
                    <Cloud ref={cloud0} {...config} bounds={[x, y, z]} color={color} />
                    <Cloud {...config} bounds={[x, y, z]} color="#eed0d0" seed={0.5} position={[15, 0, 0]} />
                    <Cloud {...config} bounds={[x, y, z]} color="#d0e0d0" seed={0.8} position={[-15, 0, 0]} />
                    <Cloud {...config} bounds={[x, y, z]} color="#a0b0d0" seed={0.9} position={[0, 0, -12]} />
                    <Cloud {...config} bounds={[x, y, z]} color="#c0c0dd" seed={1} position={[0, 0, 12]} />
                    <Cloud
                        concentrate="outside"
                        growth={100}
                        color="#ffccdd"
                        opacity={1.25}
                        seed={0.3}
                        bounds={200}
                        volume={200}
                    />
                </Clouds>
            </group>
        </>
    )
}
