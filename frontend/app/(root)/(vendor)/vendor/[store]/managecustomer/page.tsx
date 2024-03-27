'use client';

import { Button, Form, Modal, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustomerForm from '@/components/Modal/CustomerForm';
import { useEffect, useState } from 'react';
import { getCookie } from '@/components/layouts/header';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { checkStoreExists } from '@/components/utils/checkStoreExists';

const Managecustomer = ({ params }: { params: { store: string } }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [customers, setCustomers] = useState(null);

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const vendorData = useSelector((state: IRootState) => state.vendor);
    const router = useRouter();

    useEffect(() => {
        if (vendorData?.id && params.store) {
            checkStoreExists(vendorData.id, params.store).then((storeExists) => {
                console.log(storeExists);

                if (!storeExists?.success) {
                    router.push('/');
                    return;
                }
            });
        }
    }, [vendorData, params]);

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
                const data = await response.json();

                if (!response.ok) {
                    setLoading(false);

                    showMessage(data.error || 'An error occurred', 'error');
                    return;
                }


                showMessage('Customer added successfully', 'success');
                form.resetFields();
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

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const token = getCookie('tokenVendorsSagartech');
            const response = await fetch(`${process.env.ADMINURL}/api/vendors/customers/${vendorData.id}/${params.store}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            } else {
                // Handle non-200 response
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            // Handle fetch error
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        vendorData?.id && params.store && fetchCustomers();
    }, [vendorData, params.store]); // Trigger fetchCustomers whenever params.store changes

    const columns = [
        {
            title: 'Customer ID',
            dataIndex: 'customer_id',
            key: 'customer_id',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        // Add more columns as needed
    ];

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-base md:text-xl">Manage Customer ({params.store})</h1>
                <Button onClick={handleCreate} className="flex h-10 items-center justify-center gap-2 bg-blue-500 text-white md:h-12">
                    <PlusOutlined /> Create new Customer
                </Button>
            </div>

            <Table columns={columns} dataSource={customers} />
            <CustomerForm form={form} loading={loading} onsubmit={handleSubmit} modalVisible={modalVisible} onCancel={handleCancel} />
        </div>
    );
};

export default Managecustomer;
