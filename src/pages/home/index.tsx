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
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

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
    style?: React.CSSProperties;
}

export const FadeInTitle: React.FC<FadeInTitleProps> = ({
    text,
    level = 2,
    delay = 0,
    style = {}
}) => {
    return (
        <motion.div
            style={style}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
        >
            <Typography.Title
                level={level}
                style={{
                    color: "#555572",
                    fontWeight: "lighter",
                }}
            >
                {text}
            </Typography.Title>
        </motion.div>
    );
};

// Main HomePage component for the landing page
const HeroSection: React.FC = () => {
    const { styles } = useStyles();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const screens = useBreakpoint();
    /*
        screens = {
            xs: true | false,
            sm: true | false,
            md: true | false,
            lg: true | false,
            xl: true | false,
            xxl: true | false
        }
    */
    let logoSize = 250;
    if (screens.xs) {
        logoSize = 150;
    }
    return (
        <section
            ref={heroRef}
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
                    y,
                }}
            >
                <FedlifyNetwork />
            </motion.div>
            {/* Foreground text and logo with entrance animation */}
            <Flex
                justify="center"
                align="center"
                wrap
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
                <Flex
                    justify="center"
                    align="center"
                    wrap
                    gap="2.6rem"
                    style={{
                        width: '100%',
                        paddingTop: 8
                    }}
                >
                    <FedlifyLogo
                        style={{
                            width: screens.lg ? 250 : 150,
                            height: "auto"
                        }}
                        delay={1.8}
                    />
                    <Flex
                        justify="center"
                        align={screens.md ? "start" : "center"}
                        vertical={true}
                        wrap
                    >
                        <FedlifyLogoName
                            style={{
                                width: "clamp(200px, 20vw, 350px)",
                                height: "auto",
                            }}
                            delay={2}
                        />
                        <Flex
                            wrap
                            justify="center"
                            align="baseline"
                            gap={screens.md ? "6.6rem" : "2.6rem"}
                        >
                            <div>
                                <LayoutGroup>
                                    <FadeInTitle text="Unlock Precision Medicine."
                                        level={4}
                                        delay={3} />
                                    <FadeInTitle text="Collaborate Securely."
                                        level={4}
                                        delay={3}
                                        style={{ marginTop: -8 }} />
                                    <FadeInTitle text="Democratize AI."
                                        level={4}
                                        delay={3}
                                        style={{ marginTop: -8 }} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 3.5 }}
                                    >
                                        <Space style={{ marginTop: 22 }}>
                                            <Button color="default" variant="outlined">
                                                Get Started
                                            </Button>
                                            <Button color="default" variant="filled">
                                                Request a demo
                                            </Button>
                                        </Space>
                                    </motion.div>
                                </LayoutGroup>
                            </div>
                            <FadeInTitle
                                style={{
                                    maxWidth: screens.md ? "40vw" : "80vw",
                                }}
                                text="Fedlify helps healthcare researchers develop and deploy AI models collaboratively — without centralizing sensitive data."
                                level={2}
                                delay={3.25} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </section>
    );
};

const HomePage: React.FC = () => {
    // const { styles } = useStyles();
    // const screens = useBreakpoint();

    return (
        <Layout>
            <HeroSection />

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
        </Layout>
    );
};

export default HomePage;
