'use client';

import { Button, Form, Image, Input, Modal, Space, Table, Tooltip, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);

    const [form] = Form.useForm();
    const vendorData = useSelector((state: IRootState) => state.vendor);
    const router = useRouter();

    useEffect(() => {
        if (vendorData?.id && params.store) {
            checkStoreExists(vendorData.id, params.store).then((storeExists) => {
                if (!storeExists?.success) {
                    router.push('/vendor');
                }
            });
        }
    }, [vendorData, params]);

    const handleCreate = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setSelectedKey(null)
        setSelectedCountry(null)
        form.resetFields();
    };

    const handleSubmit = async (value: any) => {
        console.log(value);

        setLoading(true);
        const token = getCookie('tokenVendorsSagartech');
        const formData = new FormData();
        formData.append('data', JSON.stringify(value));
        formData.append('store_name', params.store);

        // Check if logo file exists before appending
        if (value?.customer_media) {
            formData.append('file', value.customer_media.file);
        }

        let apiUrl = `${process.env.ADMINURL}/api/vendors/customer/add`;
        let method = 'POST';

        // If selectedKey exists, we are updating an existing customer
        if (selectedKey) {
            apiUrl = `${process.env.ADMINURL}/api/vendors/customer/update/${selectedKey?.customer_id}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                showMessage(data.error || 'An error occurred', 'error');
                return;
            }

            showMessage(`Customer ${selectedKey ? 'updated' : 'added'} successfully`, 'success');
            form.resetFields();
            setModalVisible(false);

            if (selectedKey) {
                // Update the customer in the local state without fetching the whole list again
                const updatedCustomers = customers.map((customer) => (customer.customer_id === selectedKey?.customer_id ? data : customer));
                setCustomers(updatedCustomers);
            } else {
                // Add the new customer to the start of the list in the local state
                const updatedCustomer = [data.data?.[0], ...customers];
                setCustomers(updatedCustomer);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred', 'error');
        } finally {
            setLoading(false);
        }
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

    const fetchCustomers = async (page: number, pageSize: number, searchTerm: string) => {
        setLoading(true);
        try {
            const token = getCookie('tokenVendorsSagartech');
            const url = new URL(`${process.env.ADMINURL}/api/vendors/customers/${vendorData.id}/${params.store}`);

            // Append pagination parameters to the URL
            url.searchParams.append('page', page.toString());
            url.searchParams.append('pageSize', pageSize.toString());
            url.searchParams.append('searchTerm', searchTerm);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCustomers(data.customers); // Set customers state with fetched data
                // You may also need to set the total count state if you're using pagination
                setTotalCount(data.totalCount);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        vendorData?.id && params.store && fetchCustomers(1, 10, searchTerm); // Initial call with default parameters
    }, [vendorData, params]);

    const handleEdit = (record: any) => {
        // Placeholder for edit action
        setModalVisible(true);
        setSelectedCountry(record.countryjsonb);
        setSelectedKey(record);
        form.setFieldsValue(record);
    };

    const handleDelete = async (record: any) => {
        setLoading(true);
        try {
            Modal.confirm({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this customer?',
                okText: 'Delete',
                okButtonProps: { danger: true, loading: loading },
                onOk: async () => {
                    const token = getCookie('tokenVendorsSagartech');
                    const apiUrl = `${process.env.ADMINURL}/api/vendors/customer/delete/${record.customer_id}`;

                    const response = await fetch(apiUrl, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        // Remove the deleted record from the state
                        setTotalCount(totalCount - 1);
                        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.customer_id !== record.customer_id));
                        showMessage('Customer deleted successfully', 'success');
                    } else {
                        const data = await response.json();
                        showMessage(data.error || 'An error occurred while deleting the customer', 'error');
                    }
                },
            });
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred while deleting the customer', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        fetchCustomers(page, pageSize, searchTerm);
    };

    const handlePageSizeChange = (current: number, size: number) => {
        setPageSize(size);
    };

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'first_name',
            key: 'customer',
            width: 150,
            render: (_: any, record: any) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            width={40}
                            height={40}
                            fallback='/dummy-image.jpg'
                            src={record.customer_media ? `${process.env.ADMINURL}/upload/customerProfile/${record.customer_media}` : '/dummy-image.jpg'}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                            alt="Customer"
                        />
                        <div className="ml-4">
                            <div>{`${record.first_name} ${record.last_name}`}</div>
                            <div style={{ color: 'gray', fontSize: 'small' }}>{record.email}</div>
                            <div style={{ color: 'gray', fontSize: 'small' }}>{record.phone || 'N/A'}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Address',
            dataIndex: 'address_line1',
            key: 'address',
            width: 150,
            render: (_, record: any) => {
                const addressLines = [record.address_line1, record.address_line2, record.city, record.state, record.pin_code, record.address_country, record.phone_number_address].filter(
                    (part) => part
                );

                return (
                    <div>
                        {addressLines.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                        {!addressLines.length && 'N/A'}
                    </div>
                );
            },
        },

        {
            title: 'Store',
            dataIndex: 'store_name',
            key: 'store_name',
            width: 100,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-base md:text-xl">Manage Customer ({params.store})</h1>
                <Button onClick={handleCreate} className="flex h-10 items-center justify-center gap-2 bg-blue-500 text-white md:h-12">
                    <PlusOutlined /> Create new Customer
                </Button>
            </div>

            <div className="mt-5 bg-white">
                <Table
                    title={() => (
                        <div className="items-center justify-between  md:flex ">
                            <div>
                                <h1 className="text-base font-semibold tracking-wide text-gray-700">{totalCount > 1 ? `${totalCount || 0} Customers` : `${totalCount || 0} Customer`}</h1>
                            </div>

                            <div className="w-full md:w-[30%]">
                                <Input
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        fetchCustomers(1, 10, e.target.value);
                                    }}
                                    className="h-12 border !border-gray-950 placeholder:text-gray-600"
                                    placeholder="Search Customers"
                                />
                            </div>
                        </div>
                    )}
                    className="bg-white"
                    columns={columns}
                    dataSource={customers}
                    scroll={{ x: 1200, y: 600 }}
                    pagination={false}
                />
            </div>

            <div>
                <Pagination
                    hideOnSinglePage
                    className="mt-5 text-center"
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalCount}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageSizeChange}
                />
            </div>
            <CustomerForm selectedCountrydata={selectedCountry} form={form} loading={loading} onsubmit={handleSubmit} modalVisible={modalVisible} onCancel={handleCancel} />
        </div>
    );
};

export default Managecustomer;
