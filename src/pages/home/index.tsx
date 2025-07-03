/*
 * HomePage - Main landing page for Fedlify
 *
 * This file implements the main landing page of the Fedlify app using React and Ant Design components.
 *
 * Key Features:
 * - Hero section with animated parallax background using a custom 3D globe network rendered with @react-three/fiber and custom shaders.
 * - Responsive layout with Ant Design's Layout, Typography, Card, Row, and Col components.
 * - Animated transitions and parallax effects using Framer Motion.
 * - Features section highlighting app strengths.
 * - Call to Action and Footer sections.
 *
 * Notable Implementation Details:
 * - The GlobeNetworkScene component uses a custom shader material to progressively draw a wireframe icosahedron, with camera animation after completion.
 * - Parallax and scroll-based animations are handled with Framer Motion's useScroll and useTransform hooks.
 * - The design is responsive and visually engaging, with a focus on modern web aesthetics.
 */
import React, { useRef } from "react";
import { Typography, Button, Card, Row, Col, Layout, Flex, Space } from "antd";
import { motion, useScroll, useTransform } from "framer-motion";
import { FedlifyLogo, FedlifyLogoName } from "../../components/icons/fedlify";
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { useStyles } from "./styled";
const { Title, Paragraph } = Typography;
const { Footer } = Layout;

// Feature list for the landing page
const features = [
    {
        title: "Fast",
        description: "Lightning-fast performance for modern web apps.",
    },
    {
        title: "Responsive",
        description: "Works perfectly on any device size.",
    },
    {
        title: "Easy to Use",
        description: "Built with developer-friendly design in mind.",
    },
];

// Create a custom shader material for progressive wireframe drawing
const WireShaderMaterial = shaderMaterial(
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

// 3D Globe Network Scene with animated wireframe and camera
const GlobeNetworkScene: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<any>(null);
    const { camera } = useThree();

    // Create geometry and wireframe for the globe
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(3.5, 1), []);
    const wire = useMemo(() => new THREE.WireframeGeometry(geometry), [geometry]);

    // Assign a progressive index to each vertex for animation
    useMemo(() => {
        const count = wire.attributes.position.count;
        const aIndex = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            aIndex[i] = i / count;
        }
        wire.setAttribute("aIndex", new THREE.BufferAttribute(aIndex, 1));
    }, [wire]);

    // Animate the wireframe drawing and camera movement
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
        }
        if (materialRef.current) {
            materialRef.current.uProgress += delta * 0.6;
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
const GlobeNetwork: React.FC = () => {
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

// Main HomePage component for the landing page
const HomePage: React.FC = () => {
    const { styles } = useStyles();
    // Ref for the hero section to connect scroll-based parallax
    const heroRef = useRef<HTMLDivElement>(null);

    // Connect scroll position to a parallax shift using Framer Motion
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // Map scroll progress to vertical translation for parallax effect
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <Layout>
            {/* Hero section with animated parallax background and logo */}
            <section ref={heroRef}
                className={styles.hero}
            >

                {/* Parallax background with animated globe network */}
                <motion.div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0,
                        // background: `url('https://zos.alipayobjects.com/rmsportal/gGlUMYGEIvjDOOw.jpg') center/cover no-repeat`,
                        y, // same parallax
                    }}
                >
                    <GlobeNetwork />
                </motion.div>

                {/* Foreground text and logo with entrance animation */}
                <Flex
                    justify="center"
                    align="center"
                    style={{ height: '100%' }}
                >
                    <FedlifyLogo
                        style={{
                            width: "15vw",
                            height: "auto"
                        }}
                        delay={2}
                    />
                    <Space direction="vertical"

                        style={{ padding: 32 }}>
                        <FedlifyLogoName
                            style={{
                                width: "25vw",
                                height: "auto",
                                marginTop: "-3rem",
                            }}
                            delay={2.5}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, display: 'none' }}
                            animate={{ opacity: 1, y: 0, display: 'block' }}
                            transition={{ duration: 0.8, delay: 6 }}
                        >
                            <Typography.Title level={2}>
                                Federated Intelligence.
                            </Typography.Title>
                            <Typography.Title level={3}>
                                Unified Progress.
                            </Typography.Title>
                            {/* Main call-to-action button */}
                            <Button type="primary" size="large">
                                Get Started
                            </Button>
                        </motion.div>
                    </Space>

                </Flex>


            </section>

            {/* Features section with animated cards */}
            <section
                style={{
                    minHeight: "100vh",
                    background: "white",
                    padding: "60px 20px",
                }}
            >
                <Title level={2} style={{ textAlign: "center" }}>
                    Features
                </Title>
                <Row gutter={[24, 24]} justify="center">
                    {features.map((feature, idx) => (
                        <Col key={idx} xs={24} sm={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        textAlign: "center",
                                        minHeight: "220px",
                                    }}
                                >
                                    <Title level={3}>{feature.title}</Title>
                                    <Paragraph>{feature.description}</Paragraph>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Call to Action section */}
            <section
                style={{
                    minHeight: "50vh",
                    background: "#555572",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    padding: "0 20px",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1 }}
                >
                    <Title style={{ color: "white" }}>Ready to get started?</Title>
                    <Button type="default" size="large">
                        Contact Us
                    </Button>
                </motion.div>
            </section>

            {/* Footer with copyright */}
            <Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
                ©2025 Fedlify. All rights reserved.
            </Footer>
        </Layout >
    );
};

export default HomePage;


// <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 1 }}
//                     style={{
//                         position: "relative",
//                         zIndex: 1,
//                         height: "100vh",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         flexDirection: "column",
//                         padding: "0 20px",
//                     }}
//                 >
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 1 }}
//                         style={{
//                             position: "relative",
//                             background: 'red',
//                             zIndex: 1,
//                             height: "100vh",
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             flexDirection: "row",
//                             gap: "2rem",
//                         }}
//                     >
//                         {/* Fedlify logo and name */}
//                         <FedlifyLogo
//                             style={{ width: "15vw", height: "auto" }}
//                             delay={2}
//                         />
//                         <FedlifyLogoName
//                             style={{
//                                 width: "25vw",
//                                 height: "auto",
//                                 marginTop: "-3rem",
//                             }}
//                             delay={2.5}
//                         />
//                     </motion.div>


//                 </motion.div>