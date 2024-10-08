import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { Store } from './../Store';
import { getError } from '../utils';
import { toast } from 'react-hot-toast';

function SigninScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                'https://amazon-mern-backendd.onrender.com/api/users/signin',
                {
                    email,
                    password,
                }
            );
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Login success")
            navigate(redirect || '/');
        } catch (err) {
            toast.error(getError(err));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <Container className='my-5'>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <div className='w-full flex justify-center items-center text-2xl'>
                    <h1 className='mb-3 text-gray-300'>Sign In</h1>
                    </div>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className='mb-3' controlId='email'>
                            <Form.Label className='text-gray-300'>Email</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter your email'
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='password'>
                            <Form.Label className='text-gray-300'>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter your password'
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className='mb-3'>
                            <Button type='submit' variant='primary'>
                                Sign In
                            </Button>
                        </div>
                        <div className='mb-3 text-gray-300'>
                            New customer?{' '}
                            <Link to={`/signup?redirect=${redirect}`} className='text-blue-400'>Create your account</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default SigninScreen;
