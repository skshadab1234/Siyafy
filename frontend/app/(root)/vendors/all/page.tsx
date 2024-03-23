'use client';
import React, { useState, useEffect } from 'react';
import { Table, Spin, Pagination, Modal, Form, Button, Upload } from 'antd';
import { getCookie } from '@/components/layouts/header';
import IconSearch from '@/components/icon/icon-search';
import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconUserPlus from '@/components/icon/icon-user-plus';
import { BanIcon, CheckCircle, Cross, CrossIcon, DeleteIcon, ShieldAlert, TimerIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import VendorModal from '@/components/Modal/VedorModal';
import IconEdit from '@/components/icon/icon-edit';
import { UploadOutlined } from '@ant-design/icons';

const AllVendors = () => {
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loader, setLoader] = useState(false);
    const [total, setTotal] = useState(0);
    const [modalvisible, setModalVisible] = useState<boolean | null>(false);
    const [selectedRowKeys, setSelectedRowkeys] = useState<[] | null>([]);

    const [selectedKey, setSelectedkey] = useState<number | null>(null);

    const [value, setValue] = useState('list');
    const [search, setSearch] = useState<any>('');
    const token = getCookie('tokenSagartech');

    const [UploadImageButtonModal, setUploadImageButtonModal] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const fetchData = async (page: number, pageSize: number, search: string) => {
        try {
            setLoading(true);
            const response = await fetch('/api/Admin/Vendors/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ page, pageSize, search }), // Check if page and pageSize are included correctly
            });

            console.log(response.status, 'asas');

            if (response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Your session has expired, please login again.',
                    showConfirmButton: true,
                });

                // Delay the redirection by 2 seconds
                setTimeout(() => {
                    window.location.href = '/admin-login';
                }, 2000);
            }

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setVendors(data?.data || []);
            setTotal(data?.totalCount || 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, pageSize, search);
    }, []);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                return (
                    <div className="flex items-center">
                        <img
                            className="h-10 w-10 object-contain mix-blend-multiply"
                            src={`${record.vendor_image}`}
                            alt="vendor_image"
                            onError={(e) => {
                                e.target.src = '/dummy-image.jpg'; // Set fallback image path
                            }}
                        />

                        <div
                            onClick={() => {
                                setSelectedkey(record);
                                setUploadImageButtonModal(true);
                            }}
                        >
                            <IconEdit className="cursor-pointer text-gray-500" />
                        </div>
                        <h2 className="ml-2 font-semibold text-gray-600">{record.name}</h2>
                    </div>
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <a href={`mailto:${email}`}>{email}</a>,
        },

        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
            render: (phoneNumber) => <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>,
        },
        {
            title: 'Address',
            key: 'address',
            render: (record) => (
                <div>
                    <div>{record.head_office_address_line1}</div>
                    <div>{record.head_office_address_line2}</div>
                    <div>
                        {record.head_office_city}, {record.head_office_state}, {record.head_office_country}, {record.head_office_zipcode}
                    </div>
                </div>
            ),
        },
        {
            title: 'Vendor Status',
            dataIndex: 'vendor_status',
            key: 'vendor_status',
            render: (status: number) => {
                let statusText = '';
                let statusColor = '';
                let icon;

                switch (status) {
                    case 1:
                        statusText = 'Pending';
                        statusColor = 'orange';
                        icon = <TimerIcon />;
                        break;
                    case 2:
                        statusText = 'Approved';
                        statusColor = 'green';
                        icon = <CheckCircle />;
                        break;
                    case 3:
                        statusText = 'Blocked';
                        statusColor = 'red';
                        icon = <BanIcon />;
                        break;
                    case 4:
                        statusText = 'Rejected';
                        statusColor = 'red';
                        icon = <ShieldAlert />;
                        break;
                    default:
                        statusText = 'Unknown';
                        statusColor = 'gray';
                        break;
                }

                return (
                    <div className="flex items-center gap-2" style={{ color: statusColor }}>
                        {icon} {statusText}
                    </div>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div className="flex cursor-pointer items-center  gap-2 text-gray-500 hover:text-gray-950" onClick={() => editVendor(record)}>
                    <IconEdit />
                </div>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log('selectedRowKeys:', selectedRowKeys);
            setSelectedRowkeys(selectedRowKeys);
            console.log('selectedRows:', selectedRows);
        },
    };

    const editVendor = (vendor: any) => {
        console.log(vendor);
        setModalVisible(true);
        setSelectedkey(vendor);
        form.setFieldsValue(vendor);
    };

    const deleteVendor = () => {
        if (selectedRowKeys?.length <= 0) return;

        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the vendor?`,
            async onOk() {
                // Proceed with deletion
                try {
                    const res = await fetch('/api/Admin/Vendors/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ ids: selectedRowKeys }), // Send the selectedRowKeys as the ID to delete
                    });

                    if (res.status === 401) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Your session has expired, please login again.',
                            showConfirmButton: true,
                        });

                        // Delay the redirection by 2 seconds
                        setTimeout(() => {
                            window.location.href = '/admin-login';
                        }, 2000);
                    }
                    if (!res.ok) {
                        throw new Error('Failed to fetch data');
                    }

                    const updatedVendors = vendors.filter((v: any) => !selectedRowKeys.includes(v.id));
                    setVendors(updatedVendors);
                    showMessage(`${selectedRowKeys?.length} Vendor has been deleted successfully.`);

                    setSelectedRowkeys([]);
                } catch (error) {
                    console.log(error);
                }
            },
            onCancel() {
                // Do nothing if cancelled
                console.log('Deletion cancelled');
            },
            okButtonProps: { style: { backgroundColor: 'blue' } },
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

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleCreate = () => {
        form.resetFields();
        setModalVisible(true);
    };

    const onFinish = async (values: any) => {
        setLoader(true);

        try {
            const res = await fetch('/api/Admin/Vendors/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values), // Send the form values to the backend
            });

            if (!res.ok) {
                throw new Error('Failed to add vendor');
            }

            const data = await res.json();
            console.log('Success:', data);

            // Append the new vendor object to the vendors array
            setVendors([...vendors, data.data]);

            showMessage('Vendor has been added successfully.');
            form.resetFields();
            handleCancel(); // Close the modal after successful addition
        } catch (error) {
            console.error('Error:', error);
            // Handle error scenario here
        } finally {
            setLoader(false);
        }
    };

    const handleBeforeUpload = (file) => {
        // Check file type and size before uploading
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        // If both conditions are met, add the file to the fileList
        if (isImage) {
            setFileList([file]);
        }

        return false; // Prevent automatic upload
    };

    const handleUploadImage = () => {
        try {
            if (fileList.length === 0) {
                // Handle the case when there is no file to upload
                return;
            }

            const file = fileList[0]; // Get the file from fileList at index 0

            const formData = new FormData();
            formData.append('file', file);
            formData.append('selectedKey', selectedKey?.id);

            fetch(`/api/Admin/Vendors/uploadImage`, {
                method: 'POST',
                body: formData,
            })
                .then(async (response) => {
                    if (response.ok) {
                        // Handle success
                        const data = await response.json();

                        console.log(data);
                        setVendors((prevVendors) => prevVendors.map((vendor) => (vendor.id === selectedKey?.id ? data.data : vendor)));
                        setUploadImageButtonModal(false);
                        setFileList([]);
                        showMessage('Vendor Image updated successfully!');
                    } else {
                        // Handle error
                        console.error('Error sending file to the backend');
                    }
                })
                .catch((error) => {
                    // Handle network error
                    console.error('Network error:', error);
                });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Vendors</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={handleCreate}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Vendor
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                                <IconListCheck />
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                                <IconLayoutGrid />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Vendors"
                            className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setPageSize(10);
                                setSearch(e.target.value);
                                fetchData(1, 10, e.target.value);
                            }}
                        />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            <Spin spinning={loading}>
                {value === 'grid' ? (
                    <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {vendors.map((vendor) => (
                            <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]" key={vendor.id}>
                                <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]">
                                    <div className="rounded-t-md bg-white/40 bg-[url('/notification-bg.png')] bg-cover bg-center p-6 pb-0">
                                        <img
                                            className="mx-auto max-h-40 w-4/5 object-contain mix-blend-multiply"
                                            src={`${vendor.vendor_image}`}
                                            alt="vendor_image"
                                            onError={(e) => {
                                                e.target.src = '/dummy-image.jpg'; // Set fallback image path
                                            }}
                                        />
                                    </div>

                                    <div className="relative -mt-10 px-6 pb-24">
                                        <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                                            <div className="text-xl">{vendor.name}</div>
                                            {vendor.about_company && (
                                                <div className="mt-2 overflow-hidden text-gray-700 dark:text-gray-300" style={{ WebkitLineClamp: 3 }}>
                                                    {vendor.about_company}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                <div className="truncate text-white-dark">{vendor.email}</div>
                                            </div>
                                            {vendor.phone && (
                                                <div className="flex items-center">
                                                    <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                                                    <div className="text-white-dark">{vendor.phone}</div>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                                                <div className="text-white-dark">
                                                    {`${vendor.head_office_address_line1 ? vendor.head_office_address_line1 + ', ' : ''}`}
                                                    {`${vendor.head_office_address_line2 ? vendor.head_office_address_line2 + ', ' : ''}`}
                                                    {`${vendor.head_office_city ? vendor.head_office_city + ', ' : ''}`}
                                                    {`${vendor.head_office_state ? vendor.head_office_state + ', ' : ''}`}
                                                    {`${vendor.head_office_country ? vendor.head_office_country + ', ' : ''}`}
                                                    {`${vendor.head_office_zipcode ? vendor.head_office_zipcode : ''}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">
                                        <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editVendor(vendor)}>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => deleteVendor()}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5">
                        <Table
                            title={() => (
                                <div className="mt-2 flex w-1/2 gap-2 ltr:left-0 rtl:right-0">
                                    {/* <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editVendor(vendor)}>
                                        Edit
                                    </button> */}
                                    <button type="button" disabled={selectedRowKeys?.length > 0 ? false : true} className="btn btn-outline-danger w-1/2" onClick={() => deleteVendor()}>
                                        Delete ({selectedRowKeys?.length})
                                    </button>
                                </div>
                            )}
                            dataSource={vendors}
                            columns={columns}
                            pagination={false}
                            rowSelection={rowSelection}
                        />
                    </div>
                )}

                <div className="flex items-center justify-center py-10">
                    <Pagination
                        hideOnSinglePage
                        current={page}
                        total={total}
                        pageSize={pageSize}
                        showSizeChanger
                        showQuickJumper
                        onChange={(page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                            fetchData(page, pageSize, search);
                        }}
                        onShowSizeChange={(current, size) => {
                            setPage(1);
                            setPageSize(size);
                        }}
                    />
                </div>
            </Spin>

            <VendorModal form={form} loader={loader} updatedValues={onFinish} modalVisible={modalvisible} handleCancel={handleCancel} selectedKey={selectedKey} />

            <Modal
                title="Upload Image"
                visible={UploadImageButtonModal}
                // onCancel={onCancel}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setUploadImageButtonModal(false);
                            setSelectedkey(null);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="upload"
                        type="default"
                        className="bg-green-500 text-white"
                        onClick={() => handleUploadImage()}
                        // loading={CategoryLoading}
                    >
                        Upload
                    </Button>,
                ]}
            >
                <Upload name="category_image" accept=".jpg,.png" beforeUpload={handleBeforeUpload} fileList={fileList} onRemove={() => setFileList([])} listType="picture">
                    {fileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                </Upload>
            </Modal>
        </div>
    );
};

export default AllVendors;
