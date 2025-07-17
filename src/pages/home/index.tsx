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
import { Typography, Button, Card, Row, Col, Layout, Flex, Space, List } from "antd";
import { motion, useScroll, useTransform, LayoutGroup } from "framer-motion";
import { FedlifyLogo, FedlifyLogoName, FedlifyNetwork } from "../../components";
import { useStyles } from "./styled";
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

const { Title, Paragraph, Text } = Typography;
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
                                    <FadeInTitle text="Democratize Health AI."
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
                                text="Fedlify helps healthcare researchers develop and deploy AI models collaboratively — without sharing sensitive health data."
                                level={2}
                                delay={3.25} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </section>
    );
};

const ProblemSolutionSection: React.FC = () => {
    return (
        <>
            {/* Problem Section */}
            <section
                style={{
                    background: "white",
                    padding: "60px 20px",
                    minHeight: "80vh",
                }}
            >
                <Row gutter={[32, 32]} align="middle" justify="center">
                    <Col xs={24} md={12}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Title level={2}
                                style={{ marginBottom: 8 }}
                            >
                                Problem Statement</Title>
                            <Title level={4}
                                type="secondary"
                                style={{ marginTop: 0 }}
                            >
                                Fragmented Data, Fragmented AI</Title>
                            <Paragraph>
                                Healthcare data is <Text strong>sensitive</Text>,
                                <Text strong> siloed</Text>, and <Text strong>regulated</Text>.
                                As a result, data remains locked within institutional boundaries, with very limited sharing or collaboration. This fragmentation restricts access to diverse, high-quality datasets—an essential ingredient for building robust AI models.
                            </Paragraph>
                            <Paragraph>
                                Consequently, <Text strong>AI development in healthcare is also fragmented</Text>, often limited to single-center models that lack generalizability, scalability, and inclusivity. Sparse multi-institutional collaboration undermines the full potential of AI to transform healthcare at scale.
                            </Paragraph>
                            <Paragraph>
                                <Text strong>Privacy-preserving methods</Text> offer a promising alternative: they allow institutions to collaborate without transferring sensitive data, enabling access to insights and patterns across partners. However, these approaches remain largely underutilized.
                            </Paragraph>
                            <Paragraph>
                                For instance, a recent analysis found that out of more than <Text strong>3,000</Text> patient-level AI studies conducted in Canada, fewer than <Text strong>0.1%</Text> employed decentralized, privacy-preserving techniques.
                            </Paragraph>
                            <Paragraph>
                                Technical complexity, lack of accessible tools, and organizational and regulatory hurdles continue to limit broader adoption—leaving both data and AI development fragmented.
                            </Paragraph>
                        </motion.div>
                    </Col>
                    <Col xs={24} md={12}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <video
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                // width="640"
                                // height="360"
                                controls
                                // poster="thumbnail.jpg"
                                preload="metadata"
                                aria-label="Problem domain"
                            >
                                <source src="/video/problem-domain.mp4" type="video/mp4" />
                                Your browser doesn’t support HTML5 video. You can
                                <a href="video.mp4">download it here</a>.
                            </video>
                        </motion.div>
                    </Col>
                </Row>
            </section>

            {/* Solution Section */}
            <section
                style={{
                    background: "#ffffff",
                    padding: "60px 20px",
                    minHeight: "80vh",
                }}
            >
                <Row gutter={[32, 32]} align="middle" justify="center">
                    <Col xs={24} md={12} order={2} >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Title level={2}>
                                Privacy-Preserving Collaboration, Finally Made Simple
                            </Title>
                            <Paragraph style={{ fontSize: "1.2rem" }}>
                                Fedlify harnesses the power of federated learning so AI models
                                can learn from diverse, multi-institutional data — without that
                                data ever leaving its original site. Our no-code platform
                                enables researchers, clinicians, and data custodians to securely
                                collaborate, improving equity and scalability in precision
                                medicine.
                            </Paragraph>
                        </motion.div>
                    </Col>
                    <Col xs={24} md={12} order={1}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Card
                                style={{
                                    textAlign: "center",
                                    minHeight: "300px",
                                    background: "#f0f2f5",
                                }}
                            >
                                {/* Replace this with your animated flow illustration */}
                                <img
                                    src="/placeholder-data-local-models-travel.gif"
                                    alt="data stays local, models travel"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </section>
        </>
    );
};

const HomePage: React.FC = () => {
    // const { styles } = useStyles();
    // const screens = useBreakpoint();

    return (
        <Layout>
            <HeroSection />
            <ProblemSolutionSection />
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
