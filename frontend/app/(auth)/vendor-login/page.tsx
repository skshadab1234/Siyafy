'use client';
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// Define the type for the form values
interface FormValues {
    email: string;
    password: string;
}

const VendorLogin: React.FC = () => {
    const router = useRouter();
    const [loader, setLoader] = useState(false);

    const onFinish = async (values: FormValues) => {
        setLoader(true);
        try {
            const response = await fetch(`/api/Vendor/login`, {
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
                document.cookie = `tokenVendorsSagartech=${data.token}; path=/; max-age=${data.expiryTime}`;
                setTimeout(() => {
                    router.push('/vendor');
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
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/login.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link href="/" className="block w-8 lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>

                            <Form name="normal_login" className="login-form" onFinish={onFinish}>
                                <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
                                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" className='h-12' />
                                </Form.Item>
                                <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                                    <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password"  className='h-12'/>
                                </Form.Item>
                                <Form.Item>
                                    <Button loading={loader}  htmlType="submit" className="btn btn-gradient hover:!btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">
                            © {new Date().getFullYear()}.{process.env.WEBSITE_NAME} All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
