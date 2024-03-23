'use client';
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { ArrowRightCircle } from 'lucide-react';
import Termslogin from '@/components/termslogin';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Define the type for the form values
interface FormValues {
    email: string;
    password: string;
}

const AdminLogin: React.FC = () => {
    const router = useRouter();
    const [loader, setLoader] = useState(false);

    const onFinish = async (values: FormValues) => {
        setLoader(true);
        try {
            const response = await fetch(`/api/Admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            // Check the response status and show SweetAlert accordingly
            if (data.status === 200) {
                // Login successful
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: data.message,
                    showConfirmButton: false,
                    timer: 2000,
                });

                // Set the token in a cookie
                document.cookie = `tokenSagartech=${data.token}; path=/; max-age=${data.expiryTime}`;
                setTimeout(() => {
                    router.push('/admin');
                }, 2000); // 2000 milliseconds = 2 seconds
            } else {
                // Login failed
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while processing your request.',
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center from-slate-900  via-[#27716F] to-[#27716F] px-4 sm:bg-[#141414] sm:bg-gradient-to-r">
            <div className="w-full space-y-1 rounded-lg bg-white p-8 sm:max-w-md">
                <h1 className="text-2xl font-semibold tracking-wide">Log in</h1>
                <p className="text-sm tracking-wide text-gray-500">Continue to {process.env.WEBSITE_NAME}</p>
                <div className="py-10">
                    <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} className="login-form space-y-4">
                        <Form.Item
                            name="email"
                            className="mb-5"
                            rules={[
                                { required: true, message: 'Please input your Email!' },
                                {
                                    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                    message: 'Please input a valid Email!',
                                },
                            ]}
                        >
                            <Input placeholder="Email" className="mb-4 h-10 border !border-gray-900 placeholder:text-gray-500" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                            <Input.Password placeholder="Password" className="mb-4 h-10 border !border-gray-900 placeholder:text-gray-900" />
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loader} htmlType="submit" className="!hover:bg-gray-500 flex h-10 w-full items-center justify-center bg-gray-600 font-semibold tracking-wide text-white">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div>
                    <h1 className="flex text-sm tracking-wide">
                        New to {process.env.WEBSITE_NAME}?{' '}
                        <a href="#" className="ml-2 flex gap-2 font-semibold tracking-wider text-blue-600">
                            Get Started <ArrowRightCircle />
                        </a>
                    </h1>
                </div>
                <div className="pt-10">
                    <Termslogin />
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
