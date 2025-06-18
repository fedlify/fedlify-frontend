import React from 'react';
import { Typography, Card, Row, Col, Button, Space } from 'antd';
import { HomeOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons';
import { useDocumentTitle } from "@refinedev/react-router";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
    useDocumentTitle({ i18nKey: "pages.home.title" });

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <Title level={1} style={{ marginBottom: '16px' }}>
                    <HomeOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                    Welcome to Fedlify
                </Title>
                <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                    Your modern platform for seamless development and deployment.
                    Build, deploy, and scale your applications with ease.
                </Paragraph>
                <Space size="large" style={{ marginTop: '24px' }}>
                    <Button type="primary" size="large" icon={<RocketOutlined />}>
                        Get Started
                    </Button>
                    <Button size="large" icon={<StarOutlined />}>
                        Learn More
                    </Button>
                </Space>
            </div>

            {/* Features Section */}
            <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
                <Col xs={24} md={8}>
                    <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
                        <RocketOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                        <Title level={3}>Fast Deployment</Title>
                        <Paragraph>
                            Deploy your applications with lightning speed using our optimized infrastructure.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
                        <StarOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                        <Title level={3}>Easy Management</Title>
                        <Paragraph>
                            Manage your projects effortlessly with our intuitive dashboard and tools.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
                        <HomeOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
                        <Title level={3}>Reliable Hosting</Title>
                        <Paragraph>
                            Enjoy 99.9% uptime with our robust and scalable hosting infrastructure.
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            {/* About Section */}
            <Card style={{ marginBottom: '24px' }}>
                <Title level={2}>About Fedlify</Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    Fedlify is a modern platform designed to simplify the development and deployment process.
                    Whether you're a seasoned developer or just starting out, our tools and services help you
                    focus on what matters most - building great applications.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    With features like automatic scaling, continuous deployment, and comprehensive monitoring,
                    Fedlify provides everything you need to bring your ideas to life and keep them running smoothly.
                </Paragraph>
            </Card>
        </div>
    );
};

export default HomePage; 