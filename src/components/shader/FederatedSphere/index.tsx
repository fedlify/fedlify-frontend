import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, extend, ThreeElement } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
import { Group, IcosahedronGeometry, WireframeGeometry, BufferAttribute } from 'three'
import { shaderMaterial } from "@react-three/drei";

// Create a custom shader material for progressive wireframe drawing
export const WireShaderMaterial = shaderMaterial(
    { uProgress: 0 },
    // vertex
    `
    varying float vIndex;
    attribute float aIndex;
    void main() {
      vIndex = aIndex;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // fragment
    `
    varying float vIndex;
    uniform float uProgress;
    void main() {
      if(vIndex > uProgress) discard;
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // black
    }
  `
);

// Register the custom shader material with React Three Fiber
extend({ WireShaderMaterial });

// Add types to ThreeElements elements so primitives pick up on it
// see https://r3f.docs.pmnd.rs/api/typescript#extending-threeelements
declare module '@react-three/fiber' {
    interface ThreeElements {
        wireShaderMaterial: ThreeElement<typeof WireShaderMaterial>
    }
}

// 3D Globe Network Scene with animated wireframe and camera
const GlobeNetworkScene: React.FC = () => {
    const groupRef = useRef<Group>(null);
    const materialRef = useRef<any>(null);
    const { camera } = useThree();

    // Create geometry and wireframe for the globe
    const geometry = useMemo(() => new IcosahedronGeometry(3.5, 1), []);
    const wire = useMemo(() => new WireframeGeometry(geometry), [geometry]);

    // Assign a progressive index to each vertex for animation
    useMemo(() => {
        const count = wire.attributes.position.count;
        const aIndex = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            aIndex[i] = i / count;
        }
        wire.setAttribute("aIndex", new BufferAttribute(aIndex, 1));
    }, [wire]);

    // Animate the wireframe drawing and camera movement
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
        if (materialRef.current) {
            materialRef.current.uProgress += delta * 0.8;
            if (materialRef.current.uProgress >= 1) {
                materialRef.current.uProgress = 1;

                // Animate the camera after drawing is complete
                const targetZ = 3;
                camera.position.z += (targetZ - camera.position.z) * 0.05;
                camera.lookAt(0, 0, 3);
            }
        }
    });

    return (
        <>
            {/* Ambient lighting for the scene */}
            <ambientLight intensity={0.5} />
            <group ref={groupRef}>
                <lineSegments geometry={wire}>
                    {/* Custom shader material for progressive wireframe animation */}
                    <wireShaderMaterial
                        ref={materialRef}
                        transparent
                        uProgress={0}
                    />
                </lineSegments>
            </group>
            {/* User can rotate the globe, but not zoom */}
            {/* <OrbitControls enableZoom={false} /> */}
        </>
    );
};

// Canvas wrapper for the animated globe network background
export const FederatedSphere: React.FC = () => {
    return (
        <Canvas
            style={{
                position: 'absolute',
                opacity: 0.15,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'white', // match the dark theme
                zIndex: 0,
            }}
            camera={{ position: [0, 0, 8] }}>
            <GlobeNetworkScene />
        </Canvas>
    )
}
