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
import { Typography, Button, Card, Row, Col, Layout, Flex, Space, Avatar, Tag } from "antd";
import { motion, useScroll, useTransform, LayoutGroup } from "framer-motion";
import { FedlifyLogo, FedlifyLogoName, FedlifyNetwork } from "../../components";
import { useStyles } from "./styled";
import { Grid } from 'antd';
import {
    CheckCircleOutlined,
    LinkedinOutlined,
    GithubOutlined,
    DiscordOutlined
} from '@ant-design/icons';

const { useBreakpoint } = Grid;

const { Title, Paragraph, Text, Link } = Typography;
const { Footer } = Layout;

const WorkFlow = [
    {
        title: "Start a Project & Invite Sites",
        desc: [
            "Initiate a collaboration project",
            "Invite data custodians and research partners",
        ]
    },
    {
        title: "Manage Agreements & Permissions",
        desc: [
            "Secure institutional approvals and privacy agreements",
            "Assign roles and define data use boundaries",
        ]
    },
    {
        title: "Design Your AI Workflow",
        desc: [
            "Use a drag-and-drop interface to build custom AI pipelines",
            "Choose data modalities, model types, and evaluation metrics",
        ]
    },
    {
        title: "Each Site Installs the App",
        desc:
            [
                "Collaborators install Fedlify locally",
                "Connect local data sources without moving data",
            ]
    },
    {
        title: "Federated Training Begins",
        desc:
            [
                "Models are trained across sites without sharing data",
                "Updates are orchestrated securely and privately",
            ]
    },
    {
        title: "Unified Insights & Results",
        desc: [
            "Aggregated results are automatically collected",
            "Dashboards visualize cross-site performance",
        ]
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
                    // color: "#555572",
                    fontWeight: 300,
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
                    height: '100vh',
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
                                        level={5}
                                        delay={3} />
                                    <FadeInTitle text="Collaborate Securely."
                                        level={5}
                                        delay={3}
                                        style={{ marginTop: -8 }} />
                                    <FadeInTitle text="Democratize Health AI."
                                        level={5}
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
                                level={3}
                                delay={3.25} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </section>
    );
};

interface TwoColRowProps {
    left: React.ReactNode;
    right: React.ReactNode;
    background?: string;
}

const TwoColRow: React.FC<TwoColRowProps> = ({ left, right, background = 'white' }) => {
    return (
        <Card
            variant="borderless"
            styles={{
                body: {
                    background: background,
                },
            }}
        >
            <Row
                gutter={[32, 32]}
                style={{
                    width: '100%',
                    minHeight: '80vh',
                    alignContent: 'center',
                }}
            >
                <Col xs={24} md={12}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        {left}
                    </motion.div>
                </Col>
                <Col xs={24} md={12}>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        {right}
                    </motion.div>
                </Col>
            </Row>
        </Card>
    )
};

const ProblemSolutionSection: React.FC = () => {
    return (
        <>
            <TwoColRow
                left={<>
                    <Title level={2}
                        style={{
                            fontWeight: 'lighter',
                        }}
                    >
                        Fragmented Data, Fragmented AI
                    </Title>
                    <Paragraph>
                        Healthcare data is sensitive, siloed, and regulated.
                        As a result, data remains locked within institutional boundaries, with very limited sharing or collaboration. This fragmentation restricts access to diverse, high-quality datasets—an essential ingredient for building robust AI models.
                    </Paragraph>
                    <Paragraph>
                        Consequently, AI development in healthcare is also fragmented, often limited to single-center models that lack generalizability, scalability, and inclusivity. Sparse multi-institutional collaboration undermines the full potential of AI to transform healthcare at scale.
                    </Paragraph>
                    <Paragraph>
                        Privacy-preserving methods offer a promising alternative: they allow institutions to collaborate without transferring sensitive data, enabling access to insights and patterns across partners. However, these approaches remain largely underutilized.
                    </Paragraph>
                    <Paragraph>
                        For instance, a recent analysis found that out of more than 3,000 patient-level AI studies conducted in Canada, fewer than 0.1% employed decentralized, privacy-preserving techniques.
                    </Paragraph>
                    <Paragraph>
                        Technical complexity, lack of accessible tools, and organizational and regulatory hurdles continue to limit broader adoption—leaving both data and AI development fragmented.
                    </Paragraph>
                </>
                }
                right={
                    <video
                        style={{
                            width: '100%',
                            height: 'auto',
                            border: '1px solid lightgrey',
                            borderRadius: '8px'
                        }}
                        controls
                        // poster="thumbnail.jpg"
                        preload="metadata"
                        aria-label="Problem domain"
                    >
                        <source src="/video/problem-domain.mp4" type="video/mp4" />
                        Your browser doesn’t support HTML5 video. You can
                        <a href="/video/problem-domain.mp4">download it here</a>.
                    </video>
                }
            />

            <TwoColRow
                background="linear-gradient(to bottom right, white, #f8f7f462)"
                left={
                    <img
                        src="/images/who-fedlify.png"
                        alt="Who is Fedlify For?"
                        style={{ width: "100%", height: "auto" }}
                    />
                }
                right={
                    <>
                        <Title level={2}
                            // type="secondary"
                            style={{
                                // marginTop: 0,
                                fontWeight: 'lighter',
                            }}
                        >
                            Fedlify Simplifies Collaborative, Privacy-Preserving Health AI
                        </Title>
                        <Paragraph>
                            Fedlify eliminates the technical and privacy hurdles that hinder collaborative AI development in healthcare. By using our no-code platform, institutions can contribute to AI development without transferring sensitive data. Every stakeholder—from healthcare researchers and data custodians to AI developers and IT managers—can participate confidently. Built on privacy-preserving federated learning, Fedlify ensures secure, scalable, and equitable collaboration across diverse institutional settings.
                        </Paragraph>
                    </>
                }

            />

        </>
    );
};

const Features: React.FC = () => {
    return (
        < Card
            variant="borderless"
            styles={{
                body: {
                    paddingTop: "5em",
                    paddingBottom: "5em",
                    background: "#F5F5F5",
                    minHeight: '80vh',
                    alignContent: 'center'
                },
            }
            }
        >
            <Title level={2} style={{
                textAlign: "center",
                fontWeight: 'lighter',
            }}>
                How Fedlify Works
            </Title>
            <Row gutter={[24, 24]} justify="center">
                {WorkFlow.map((stage, idx) => (
                    <Col key={idx} xs={24} sm={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Card
                                title={
                                    <>
                                        <Avatar
                                            size={48}
                                            style={{
                                                zIndex: 10,
                                                backgroundColor: '#A892AB',
                                                // color: '#f56a00',
                                            }}
                                        >
                                            {idx + 1}
                                        </Avatar>
                                        <Tag
                                            color="#806484"
                                            style={{
                                                marginLeft: -8,
                                                paddingLeft: "1.5em",
                                                paddingRight: "1em",
                                            }}>
                                            <Text
                                                style={{
                                                    color: "white",
                                                    // fontSize: 17,
                                                    // fontWeight: 'lighter',
                                                }}
                                            >
                                                {stage.title}
                                            </Text>
                                        </Tag>
                                    </>
                                }>
                                <Space direction="vertical">
                                    {
                                        stage.desc.map((item) => (
                                            <Space align="start">
                                                <CheckCircleOutlined color="red" />
                                                {item}
                                            </Space>
                                        ))
                                    }
                                </Space>
                            </Card>

                        </motion.div>
                    </Col>
                ))}
            </Row>
        </Card >
    );
}

const CallToAction: React.FC = () => {
    return (
        <Card
            variant="borderless"
            style={{
                minHeight: "50vh",
                background: "#555573",
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
                <Title style={{
                    color: "white",
                    fontWeight: 'lighter',
                }}>
                    Ready to get started?</Title>
                <Button type="default" size="large">
                    Contact Us
                </Button>
            </motion.div>
        </Card>

    );
}
const HomePage: React.FC = () => {
    // const { styles } = useStyles();
    // const screens = useBreakpoint();

    return (
        <Layout>
            <HeroSection />
            <ProblemSolutionSection />
            <Features />
            <CallToAction />
            {/* Footer with copyright */}
            <Footer
                // className={styles.animatedFooter}
                style={{ background: "#f0f2f5", fontWeight: 'lighter' }}
            >
                <Flex wrap justify="space-evenly" gap="large">
                    <Space.Compact direction="vertical">
                        <Text style={{ fontSize: "lighter" }}>Contact </Text>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            dev@fedlify.com
                        </Link>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            support@fedlify.com
                        </Link>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            info@fedlify.com
                        </Link>
                    </Space.Compact>

                    <Space.Compact direction="vertical">
                        <Text style={{ fontSize: "lighter" }}>Regulatory </Text>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            Website privacy policy
                        </Link>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            Cookie policy
                        </Link>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            Cookie settings
                        </Link>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            Accessibility statement
                        </Link>
                        <Link style={{ fontSize: 15, color: 'grey' }} href="https://ant.design" target="_blank">
                            Quality & Regulatory
                        </Link>
                    </Space.Compact>
                    <Space direction="vertical">
                        <Flex gap="large" align="center" justify="center">
                            <FedlifyLogo width={42} />
                        </Flex>
                        <Flex style={{ marginTop: 12 }} gap="large" align="center" justify="center">
                            <LinkedinOutlined style={{ fontSize: 22, color: 'grey' }} />
                            <svg viewBox="0 0 24 24" aria-hidden="true"
                                style={{ width: 22, height: 22 }}  >
                                <path fill="grey" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <GithubOutlined style={{ fontSize: 22, color: 'grey' }} />
                            <DiscordOutlined style={{ fontSize: 22, color: 'grey' }} />
                        </Flex>
                        <Text style={{ fontSize: "lighter", color: 'grey' }}> ©2025 Fedlify. All rights reserved. </Text>

                    </Space>
                </Flex>
            </Footer>
        </Layout >
    );
};

export default HomePage;
