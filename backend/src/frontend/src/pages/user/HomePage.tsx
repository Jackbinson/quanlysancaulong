// src/views/user/HomePage.tsx
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap'; // Thêm Row, Col để thay thế Jumbotron
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Optional: Render loading state or redirect if currentUser is null/undefined
    // For this example, we'll let the Jumbotron handle the 'bạn' fallback,
    // but in a real app, you might want a PrivateRoute or similar.

    return (
        <Container className="mt-4">
            {/* Thay thế Jumbotron bằng Container, Row, Col và các tiện ích Bootstrap */}
            <Container className="text-center bg-light p-5 rounded">
                <h1>Chào mừng {currentUser ? currentUser.email : 'bạn'} đến với hệ thống đặt sân!</h1>
                <p className="lead">
                    Bạn có thể đặt sân, xem lịch sử đặt sân và quản lý tài khoản của mình tại đây.
                </p>
                <hr className="my-4" />
                <p>
                    Hãy khám phá các chức năng của chúng tôi.
                </p>
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Button variant="primary" onClick={() => navigate('/booking')}>Đặt sân ngay</Button>
                    </Col>
                    <Col xs="auto">
                        {currentUser && <Button variant="secondary" onClick={handleLogout}>Đăng xuất</Button>}
                    </Col>
                </Row>
            </Container>

            {/* Thêm các phần khác của trang chủ tại đây */}
        </Container>
    );
};

export default HomePage;