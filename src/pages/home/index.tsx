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
import { motion, useScroll, useTransform, LayoutGroup } from "framer-motion";
import { FedlifyLogo, FedlifyLogoName, FedlifyNetwork } from "../../components";
import { useStyles } from "./styled";

const { Title, Paragraph } = Typography;
const { Footer } = Layout;

// Feature list for the landing page
const features = [
    {
        title: "Federated Model Training",
        description: "Train models collaboratively without moving raw data.",
    },
    {
        title: "Privacy & Security First",
        description: "Comply with international frameworks (HIPAA, GDPR, etc).",
    },
    {
        title: "Interoperability",
        description: "Supports FAIR data principles and standard data schemas.",
    },
    {
        title: "Low-Code Collaboration",
        description: "Empower clinicians and non-technical researchers to participate.",
    },
    {
        title: "Model Explainability",
        description: "Integrated tools for transparency and trust.",
    },
    {
        title: "Scalable & Flexible",
        description: "Works for small pilots and multinational studies alike.",
    },
];

interface FadeInTitleProps {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5;
    delay?: number;
}

export const FadeInTitle: React.FC<FadeInTitleProps> = ({
    text,
    level = 2,
    delay = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
        >
            <Typography.Title
                level={level}
                style={{ color: "#555572", fontWeight: "normal" }}
            >
                {text}
            </Typography.Title>
        </motion.div>
    );
};

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
                    <FedlifyNetwork />
                </motion.div>

                {/* Foreground text and logo with entrance animation */}
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        height: '100%',
                        width: '100%',
                        // background: 'red',
                        paddingLeft: '10vw',
                        paddingRight: '10vw'
                    }}
                >
                    <FedlifyLogo
                        style={{
                            width: "45vw",
                            height: "auto"
                        }}
                        delay={1.8}
                    />
                    <Space direction="vertical"
                        style={{
                            padding: 32,
                            width: '100%',
                            // background: 'yellow'
                        }}>
                        <FedlifyLogoName
                            style={{
                                width: "clamp(200px, 20vw, 350px)",
                                height: "auto",
                                // marginTop: "-3rem",
                            }}
                            delay={2}
                        />
                        <LayoutGroup>
                            <FadeInTitle text="Unlock Precision Medicine." level={3} delay={3} />
                            <FadeInTitle text="Collaborate Securely." level={3} delay={3} />
                            <FadeInTitle text="Democratize AI." level={3} delay={3} />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 3.5 }}
                            >
                                <Space>
                                    <Button type="primary" size="large">
                                        Get Started
                                    </Button>
                                    <Button size="large">
                                        Request a demo
                                    </Button>
                                </Space>

                            </motion.div>
                        </LayoutGroup>
                    </Space>
                    <FadeInTitle text="Fedlify helps healthcare researchers develop and deploy AI models collaboratively — without centralizing sensitive data." level={2} delay={3.25} />
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
                    background: "#4C5270",
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
