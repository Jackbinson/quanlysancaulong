// src/layouts/UserLayout.tsx
import React, { ReactNode } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserLayoutProps {
    children?: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/">Hệ thống đặt sân</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                            <Nav.Link as={Link} to="/booking">Đặt sân</Nav.Link>
                            {/* Thêm các link người dùng khác */}
                            <Nav.Link as={Link} to="/history">Lịch sử đặt sân</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Tài khoản</Nav.Link>
                        </Nav>
                        <Nav>
                            {currentUser ? (
                                <>
                                    <span className="nav-link text-dark me-2">
                                        Chào, {currentUser.email}
                                    </span>
                                    {currentUser.role === 'admin' && (
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => navigate('/admin/dashboard')}>
                                            Admin Dashboard
                                        </Button>
                                    )}
                                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                        Đăng xuất
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate('/login')}>
                                        Đăng nhập
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                {children || <Outlet />} {/* Render children hoặc Outlet tùy thuộc cách sử dụng */}
            </Container>
        </>
    );
};

export default UserLayout;