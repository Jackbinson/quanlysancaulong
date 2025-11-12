// src/views/admin/RevenueDashboard.tsx
import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

const RevenueDashboard: React.FC = () => {
    // Dữ liệu giả định cho dashboard
    const totalRevenue = 15000000; // VND
    const totalBookings = 250;
    const pendingPayments = 5;
    const recentTransactions = [
        { id: 'TX001', date: '2023-10-26', amount: 500000, status: 'Completed' },
        { id: 'TX002', date: '2023-10-26', amount: 250000, status: 'Pending' },
        { id: 'TX003', date: '2023-10-25', amount: 750000, status: 'Completed' },
        { id: 'TX004', date: '2023-10-25', amount: 300000, status: 'Completed' },
    ];

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Dashboard Quản lý Doanh thu</h2>
            <Row>
                <Col md={4} className="mb-4">
                    <Card className="text-white bg-primary">
                        <Card.Body>
                            <Card.Title>Tổng Doanh thu</Card.Title>
                            <Card.Text>
                                <h3>{totalRevenue.toLocaleString()} VND</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-white bg-success">
                        <Card.Body>
                            <Card.Title>Tổng số lượt đặt sân</Card.Title>
                            <Card.Text>
                                <h3>{totalBookings}</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="text-white bg-warning">
                        <Card.Body>
                            <Card.Title>Thanh toán đang chờ</Card.Title>
                            <Card.Text>
                                <h3>{pendingPayments}</h3>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>Giao dịch gần đây</Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Mã giao dịch</th>
                                        <th>Ngày</th>
                                        <th>Số tiền</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.id}</td>
                                            <td>{transaction.date}</td>
                                            <td>{transaction.amount.toLocaleString()} VND</td>
                                            <td>{transaction.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RevenueDashboard;