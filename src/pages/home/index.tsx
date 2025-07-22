import React, { useRef, useState } from "react";
import { Typography, Button, Card, Row, Col, Layout, Flex, Space, Avatar, Tag } from 'antd';
import { motion, useScroll, useTransform, LayoutGroup } from "framer-motion";
import { FedlifyLogo, FedlifyLogoName, FedlifyNetwork } from "../../components";
import { useStyles } from "./styled";
import { Grid } from 'antd';
import type { GetProps } from 'antd';
import Icon, {
    CheckCircleOutlined,
    LinkedinOutlined,
    GithubOutlined,
    DiscordOutlined
} from '@ant-design/icons';

const { useBreakpoint } = Grid;

const { Title, Paragraph, Text, Link } = Typography;
const { Footer } = Layout;

interface FadeInTitleProps {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5;
    delay?: number;
    style?: React.CSSProperties;
}

const FadeInTitle: React.FC<FadeInTitleProps> = ({
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
                    fontWeight: 300,
                }}
            >
                {text}
            </Typography.Title>
        </motion.div>
    );
};

interface HeroSectionProps {
    heroClassName?: string;
    isDarkMode?: boolean;
};

const HeroSection: React.FC<HeroSectionProps> = ({ heroClassName, isDarkMode = false }) => {
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
            className={heroClassName}
        >
            {/* Parallax background with animated globe network */}
            <motion.div
                style={{
                    // background: background,
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
                    minHeight: '100vh',
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
                        isDarkMode={isDarkMode}
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
                            isDarkMode={isDarkMode}
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
interface DualColumnLayoutProps {
    leftColumn: React.ReactNode;
    rightColumn: React.ReactNode;
    // background?: string;
}

interface SlideInColumnProps {
    children: React.ReactNode;
    x: number;
}

const SlideInColumn: React.FC<SlideInColumnProps> = ({ x, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            {children}
        </motion.div>
    );
}

const DualColumnLayout: React.FC<DualColumnLayoutProps> = ({ leftColumn, rightColumn }) => {
    return (
        <Card variant="borderless">
            <Row
                gutter={[32, 32]}
                style={{
                    width: '100%',
                    minHeight: '80vh',
                    alignContent: 'center',
                }}
            >
                <Col xs={24} md={12}>
                    <SlideInColumn x={-50}>
                        {leftColumn}
                    </SlideInColumn>
                </Col>
                <Col xs={24} md={12}>
                    <SlideInColumn x={50}>
                        {rightColumn}
                    </SlideInColumn>

                </Col>
            </Row>
        </Card>
    )
};

interface ProblemSectionProps {
    videoClassName?: string;
};

const ProblemSection: React.FC<ProblemSectionProps> = ({ videoClassName }) => {
    return (
        <DualColumnLayout
            leftColumn={<>
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
            rightColumn={
                <video
                    className={videoClassName}
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
    );
};

interface ProblemSectionProps {
    imageClassName?: string;
};

const SolutionSection: React.FC<ProblemSectionProps> = ({ imageClassName }) => {
    return (
        <DualColumnLayout
            leftColumn={
                <img
                    className={imageClassName}
                    src="/images/who-fedlify.png"
                    alt="Who is Fedlify For?"
                />
            }
            rightColumn={
                <>
                    <Title level={2}
                        style={{
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
    );
};

interface WorkFlowSectionProps {
    background?: string;
};

const WorkFlowSection: React.FC<WorkFlowSectionProps> = ({ background }) => {
    const Steps = [
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
    return (
        < Card
            variant="borderless"
            styles={{
                body: {
                    paddingTop: "5em",
                    paddingBottom: "5em",
                    background: background,
                    minHeight: '80vh',
                    alignContent: 'center'
                },
            }}
        >
            <Title
                level={2}
                style={{
                    textAlign: "center",
                    fontWeight: 'lighter',
                }}>
                How Fedlify Works
            </Title>
            <Row gutter={[24, 24]} justify="center">
                {Steps.map((stage, idx) => (
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

interface FadeInProps {
    children: React.ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
        >
            {children}
        </motion.div>
    );
};

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
            <FadeIn>
                <Title
                    style={{
                        color: "white",
                        fontWeight: 'lighter',
                    }}
                >
                    Ready to get started?
                </Title>
                <Button type="primary" size="large">
                    Contact Us
                </Button>
            </FadeIn>
        </Card>
    );
}

type XIconComponentProps = GetProps<typeof Icon>;

interface XSvgProps {
    width?: number | string;
    height?: number | string;
    fill?: string;
}
const XSvg: React.FC<XSvgProps> = ({
    width = '1em',
    height = '1em',
    fill = 'currentColor'
}) => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        width={width}
        height={height}
    >
        <path
            fill={fill}
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
    </svg>
)

const XLogo = (props: Partial<XIconComponentProps>) => {
    return (
        <Icon component={XSvg} {...props} />
    );
};

const useHoverColor = () => {
    const [hovered, setHovered] = useState(false);
    const { theme } = useStyles();

    const hoveredColor = theme.appearance === 'dark' ? 'white' : 'black';

    return {
        hovered,
        setHovered,
        color: hovered ? hoveredColor : 'grey',
    };
};

const HoverLink: React.FC<{ href: string; text: string }> = ({ href, text }) => {
    const { color, setHovered, hovered } = useHoverColor();

    return (
        <Link
            style={{
                fontSize: 15,
                textShadow: hovered ? "2px 2px 5px rgba(0, 0, 0, 0.3)" : "",
                color: color,
                transition: 'color 0.3s',
            }}
            href={href}
            target="_blank"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {text}
        </Link>
    );
};

const socialLinks = [
    { icon: <LinkedinOutlined />, href: 'https://www.linkedin.com/company/fedlify' },
    { icon: <XLogo />, href: 'https://x.com/fedlify' },
    { icon: <GithubOutlined />, href: 'https://github.com/fedlify' },
    { icon: <DiscordOutlined />, href: 'https://discord.gg/fedlify' },
];

interface SocialIconProps {
    icon: React.ReactNode;
    href: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href }) => {
    const { color, setHovered } = useHoverColor();

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 24, color: color, transition: 'color 0.3s' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {icon}
        </a>
    );
};

interface FooterSectionProps {
    isDarkMode?: boolean;
};

const FooterSection: React.FC<FooterSectionProps> = ({ isDarkMode = false }) => {
    return (
        <Footer
            style={{
                fontWeight: 'lighter'
            }}
        >
            <FadeIn>
                <Flex wrap justify="space-evenly" gap="large">
                    <Space.Compact direction="vertical">
                        <Text style={{ fontSize: "lighter" }}>Contact </Text>
                        <HoverLink href="mailto:support@fedlify.com" text="Support Team" />
                        <HoverLink href="mailto:dev@fedlify.com" text="Engineering Team" />
                    </Space.Compact>

                    <Space.Compact direction="vertical">
                        <Text style={{ fontSize: "lighter" }}>Regulatory </Text>
                        <HoverLink href="/privacy-policy" text="Website privacy policy" />
                        <HoverLink href="/cookie-policy" text="Cookie policy" />
                        <HoverLink href="/cookie-settings" text="Cookie settings" />
                        <HoverLink href="/accessibility" text="Accessibility statement" />
                        <HoverLink href="/quality-and-regulatory" text="Quality & Regulatory" />
                    </Space.Compact>
                    <Space direction="vertical">
                        <Flex gap="large" align="center" justify="center">
                            <FedlifyLogo width={42} isDarkMode={isDarkMode} />
                        </Flex>
                        <Flex style={{ marginTop: 12 }} gap="large" align="center" justify="center">
                            {socialLinks.map(({ icon, href }, idx) => (
                                <SocialIcon key={idx} icon={icon} href={href} />
                            ))}
                        </Flex>
                        <Text
                            style={{
                                fontSize: "lighter",
                                color: 'grey',
                            }}
                        >
                            ©2025 Fedlify. All rights reserved.
                        </Text>
                    </Space>
                </Flex >
            </FadeIn>
        </Footer >
    );
}

const HomePage: React.FC = () => {
    const { styles, theme } = useStyles();
    const isDarkMode = theme.appearance === 'dark';
    return (
        <Layout>
            <HeroSection heroClassName={styles.hero} isDarkMode={isDarkMode} />
            <ProblemSection videoClassName={styles.videoBorder} />
            <SolutionSection imageClassName={styles.imageBorder} />
            <WorkFlowSection background={isDarkMode ? '#202123' : '#F5F5F5'} />
            <CallToAction />
            <FooterSection isDarkMode={isDarkMode} />
        </Layout >
    );
};

export default HomePage;
