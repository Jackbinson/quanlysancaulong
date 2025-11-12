// src/layouts/AdminLayout.tsx
import React, { ReactNode } from 'react';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap'; // Thêm Button vào đây
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
    children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Kiểm tra xem người dùng hiện tại có phải là admin không
    if (!currentUser || currentUser.role !== 'admin') {
        // Bạn có thể chuyển hướng người dùng không phải admin đi nơi khác
        // hoặc hiển thị một thông báo lỗi
        return (
            <Container className="mt-5 text-center">
                <h2>Truy cập bị từ chối</h2>
                <p>Bạn không có quyền truy cập vào trang quản trị. Vui lòng đăng nhập với tài khoản Admin.</p>
                <Button variant="primary" onClick={() => navigate('/login')}>Đăng nhập</Button>
            </Container>
        );
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/admin/dashboard">Admin Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="admin-navbar-nav" />
                    <Navbar.Collapse id="admin-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/admin/dashboard">Doanh thu</Nav.Link>
                            <Nav.Link as={Link} to="/admin/vouchers">Voucher</Nav.Link>
                            {/* Thêm các link quản trị khác tại đây */}
                            <Nav.Link as={Link} to="/admin/users">Quản lý người dùng</Nav.Link>
                            <Nav.Link as={Link} to="/admin/courts">Quản lý sân</Nav.Link>
                        </Nav>
                        <Nav>
                            <span className="navbar-text text-white me-3">
                                Xin chào, {currentUser.email} ({currentUser.role})
                            </span>
                            <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container fluid>
                <Row>
                    <Col>
                        {children || <Outlet />} {/* Render children hoặc Outlet tùy thuộc cách sử dụng */}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminLayout;