'use client';

import { Button, Form, Modal, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomerForm from '@/components/Modal/CustomerForm';
import { useState } from 'react';
import { getCookie } from '@/components/layouts/header';
import Swal from 'sweetalert2';

const Managecustomer = ({ params }: { params: { store: string } }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = (value: any) => {
        setLoading(true);
        const token = getCookie('tokenVendorsSagartech');
        const formData = new FormData();
        formData.append('data', JSON.stringify(value));
        formData.append('store_name', params.store);

        // Check if logo file exists before appending
        if (value?.customer_media) {
            formData.append('file', value.customer_media.file);
        }

        const apiUrl = `${process.env.ADMINURL}/api/vendors/customer/add`;

        // Determine the HTTP method based on whether it's an add or edit operation

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json();
                    setLoading(false);

                    showMessage(data.error || 'An error occurred', 'error');
                    return;
                }

                showMessage('Customer added successfully', 'success');
                form.resetFields()
                setLoading(false);

                setModalVisible(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                showMessage('An error occurred', 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    };

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

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-base md:text-xl">Manage Customer ({params.store})</h1>
                <Button onClick={handleCreate} className="flex h-10 items-center justify-center gap-2 bg-blue-500 text-white md:h-12">
                    <PlusOutlined /> Create new Customer
                </Button>
            </div>

            <Table />
            <CustomerForm form={form} loading={loading} onsubmit={handleSubmit} modalVisible={modalVisible} onCancel={handleCancel} />
        </div>
    );
};

export default Managecustomer;
