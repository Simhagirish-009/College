import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { verifyCodeAndResetPassword } from '../api';  // API call to reset password

const Reset = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const email = localStorage.getItem('email')

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const cleanedEmail = email.replace(/^"|"$/g, ''); 
            console.log(email)
            await verifyCodeAndResetPassword(cleanedEmail,verificationCode, newPassword);
            setMessage('Password reset successful. You may now log in.');
        } catch (error) {
            setMessage('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="form-background">
            <div className="form-container">
                <Card className="form-card animate__animated animate__zoomIn">
                    <Card.Header>
                        <Card.Title><h3>Reset Password</h3></Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handlePasswordReset}>
                            <Form.Group className="form-group">
                                <Form.Label>Verification Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <br />
                            <Form.Group className="form-group">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <br />
                            <Form.Group className="form-group">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <br />
                            <Button className="btn" type="submit">Reset Password</Button>
                            <br />
                            {message && <Alert variant="info" className="mt-3">{message}</Alert>}
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Reset;
