import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { otp_verify, resend_otp } from '../api'; // Import the resend OTP function
// <<<<<<< HEAD
import { toast } from 'react-toastify';
// =======
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [seconds, setSeconds] = useState(60);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setMessage('You can request a new OTP now.');
        }
    }, [seconds]);

    const handleOtpChange = (element, index) => {
        const value = element.value;
        if (/^\d{0,1}$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d{6}$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            inputRefs.current[5].focus();
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const otpValue = otp.join('');
        const email = JSON.parse(localStorage.getItem('email'));
        try {
            const response = await otp_verify({ otp: otpValue, email });
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('role', response.data.role);
// <<<<<<< HEAD
                toast.success('verification successfull !!!')
                // Redirect based on user role
                switch (response.data.role) {
                    case 1:
                        window.history.forward();
                        navigate('/admindash/');

                        break;
                    case 2:
                        window.history.forward();
                        navigate('/staffdash/');
                        break;
                    case 3:
                        window.history.forward();
                        navigate('/studash/');
// =======
                
                // Redirect based on user role
                // switch (response.data.role) {
                //     case 1:
                //         navigate('/admindash');
                //         break;
                //     case 2:
                //         navigate('/staffdash');
                //         break;
                //     case 3:
                //         navigate('/studash');
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            setLoading(false);
            setMessage('OTP verification failed: ' + error.response.data.error);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        const email = JSON.parse(localStorage.getItem('email'));
        try {
            const response = await resend_otp({ email });
            if (response.data.message) {
                setMessage(response.data.message);
                setSeconds(60); // Reset timer for the new OTP
            }
        } catch (error) {
            setMessage('Failed to resend OTP: ' + error.response.data.error);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className='form-background'>
            <div className='form-container'>
                <Card className='form-card animate__animated animate__zoomIn'>
                    <Card.Header>
                        <Card.Title>OTP Verification</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className='form-group'>
                                <Form.Label>Enter OTP:</Form.Label>
                                <div className="d-flex justify-content-center">
                                    {otp.map((data, index) => (
                                        <Form.Control
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onPaste={handlePaste}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            className="otp-input"
                                            style={{ width: '40px', textAlign: 'center', marginRight: '5px' }}
                                            inputMode="numeric"
                                        />
                                    ))}
                                </div>
                            </Form.Group><br />
                            <Form.Group className='form-group d-flex justify-content-center'>
                                <button className='btn' type='submit'>
                                    {loading ? <div>Please wait... <Spinner animation="border" size="sm" /></div> : 'Login'}
                                </button>
                            </Form.Group>
                            <br />
                            {message && <Alert variant='danger'>{message}</Alert>}
                            {seconds === 0 && (
// <<<<<<< HEAD
                            <div className='btnn'>
                            <Button className='bttn px-5' variant="success" onClick={handleResendOtp} disabled={resending}>
                                {resending ? <Spinner animation="border" size="sm" /> : 'Resend OTP'}
                            </Button>
                            </div>
// =======
                            // <Button variant="success" onClick={handleResendOtp} disabled={resending}>
                            //     {resending ? <Spinner animation="border" size="sm" /> : 'Resend OTP'}
                            // </Button>
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
                            )}
                        </Form>
                    </Card.Body>
                    <Card.Footer className='text-center'>
                        Your validation time is: {seconds}
                        <br />
                    </Card.Footer>
                </Card>
            </div>
        </div>
    );
};

export default Otp;
