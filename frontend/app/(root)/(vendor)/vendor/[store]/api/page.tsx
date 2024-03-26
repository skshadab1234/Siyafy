'use client';
import { Adminurl } from '@/app/layout';
import { getCookie } from '@/components/layouts/header';
import { Button, Table, message } from 'antd';
import { Copy, CopyPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ApiKey = ({ params }: { params: { store: string } }) => {
    const token = getCookie('tokenVendorsSagartech');

    const [loadAPis, setAPis] = useState([]);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const createApikey = async () => {
        try {
            const response = await fetch('/api/Vendor/createApi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ store_name: params.store }),
            });

            const res = await response.json();
            if (res.success) {
                showMessage(res.message, 'success');
                getApiKey()
            } else {
                showMessage(res.error, 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: 'API Key',
            dataIndex: 'apiKey',
            key: 'apiKey',
            render: (apiKey: string) => (
                <div className="flex items-center gap-4">
                    <p>{`${apiKey}`}</p>
                    <CopyPlus className="cursor-pointer text-[10px] text-gray-400 hover:text-black/80" onClick={() => handleCopyApiKey(apiKey)} />
                </div>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(), // Format datetime
        },
    ];

    const handleCopyApiKey = (apiKey: string) => {
        // Logic to copy the API key to the clipboard
        navigator.clipboard.writeText(apiKey);
        message.success('API Key copied to clipboard');
    };

    const getApiKey = async () => {
        try {
            const res = await fetch(`${process.env.ADMINURL}/api/Vendor/getApi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ store_name: params.store }),
            });

            if (!res.ok) {
                throw new Error(`Could not get API key for Store "${params.store}"`);
            }

            const resData = await res.json();

            setAPis(resData?.[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getApiKey();
    }, []);

    console.log(loadAPis);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-base md:text-xl">Manage Api Key</h1>
                <Button onClick={createApikey} className="h-10 bg-blue-500 text-white md:h-12 md:px-10">
                    Create Api Key
                </Button>
            </div>

            <div className='mt-10  dark:bg-slate-950 text-white'>
                <Table columns={columns} dataSource={loadAPis} />
            </div>
        </div>
    );
};

export default ApiKey;
