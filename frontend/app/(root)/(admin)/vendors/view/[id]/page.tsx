'use client';

import { Adminurl } from '@/app/layout';
import Heading from '@/components/Heading';
import ManageStoreModal from '@/components/Modal/ManageStoreModal';
import { getCookie } from '@/components/layouts/header';
import { Button, Form } from 'antd';
import { ArrowUpRight, MessageCircle, PencilIcon, PhoneCallIcon, PlusCircle } from 'lucide-react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ViewVendor = () => {
    const { id } = useParams();
    const router = useRouter();
    const [form] = Form.useForm();

    if (!id) return router.push('/');

    const [vendorData, setVendorData] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const token = getCookie('tokenSagartech');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return; // Exit if no id is found

            try {
                const response = await fetch(`${process.env.ADMINURL}/api/vendors/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include authorization token
                    },
                });

                if (!response.ok) {
                    throw new Error('Data could not be fetched');
                }

                const data = await response.json();
                setVendorData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, [id]); // Dependency array, re-run useEffect when `id` or `token` changes

    const handleOpenModal = (store: any) => {
        setSelectedRow(store);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (value: any) => {
        console.log(value, 'valle');

        const formData = new FormData();
        formData.append('vendor_id', id);
        formData.append('data', JSON.stringify(value));
        formData.append('selectedRow', selectedRow ? JSON.stringify(selectedRow) : []);

        // Check if logo and banner URLs are provided
        formData.append('file', value?.logo_url?.file);
        formData.append('file', value?.banner_url?.file);

        // Determine the API endpoint based on whether it's an add or edit operation
        const apiUrl = `${process.env.ADMINURL}/api/vendors/store/add`;

        // Determine the HTTP method based on whether it's an add or edit operation

        fetch(apiUrl, {
            method: 'POST',
            body: formData,
        })
            .then(async (response) => {
                if (response.ok) {
                    // Handle success
                    const data = await response.json();
                    console.log(data);
                    setSubmitting(false);
                    showMessage(selectedRow ? 'Store updated successfully' : 'Store added successfully');
                    setIsModalOpen(false);
                    form.resetFields();
                } else {
                    // Handle error
                    console.error('Error sending file to the backend');
                }
            })
            .catch((error) => {
                // Handle network error
                console.error('Network error:', error);
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

    const renderNOFound = () => {
        return (
            <div className="mb-10 flex w-full justify-center">
                <div className="flex h-96 w-96 flex-col justify-center ">
                    <img src="/nofound.gif" />
                    <Button onClick={handleOpenModal} className="flex h-20 w-full items-center justify-center gap-2 rounded-full bg-black p-4 text-xl text-white">
                        <PlusCircle size={24} /> Create new store
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="hidden items-center gap-4 bg-white p-4 shadow-md md:flex">
                <div>
                    <img
                        className="h-12 w-12 rounded-full"
                        src={`${process.env.ADMINURL}/upload/vendorImage/${vendorData?.vendor_image}`}
                        alt="vendor_image"
                        onError={(e) => {
                            e.target.src = '/dummy-image.jpg'; // Set fallback image path
                        }}
                    />
                </div>
                <div className="flex w-full justify-between ">
                    <div>
                        <h2 className="text-base font-semibold md:text-xl">{vendorData?.name}</h2>
                        <p className="text-gray-700 dark:text-gray-300">{vendorData?.about_company}</p>
                    </div>
                    <div className="flex items-center space-y-2">
                        <p className="inline-block text-lg">{vendorData?.email}</p>
                        <div className="mx-2 h-4 w-px bg-gray-400"></div>
                        <p className="inline-block">{vendorData?.phone_number}</p>
                        <div className="mx-2 h-4 w-px bg-gray-400"></div>
                        <p className="inline-block">{moment(vendorData?.joined_date).format('LLL')}</p>
                        <div className="mx-2">
                            <a href="#" className="text-blue-500">
                                <MessageCircle size={16} />
                            </a>
                        </div>
                        <div className="mx-2">
                            <a href="#" className="text-blue-500">
                                <PhoneCallIcon size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="mt-10 gap-2 shadow-md md:flex">
                <div className="flex w-full gap-5 bg-white md:w-9/12 ">
                    <div className="flex items-center justify-center px-4">
                        <img
                            src={`${process.env.ADMINURL}/upload/vendorImage/${vendorData?.vendor_image}`}
                            alt="vendor_image"
                            className="object-cover"
                            onError={(e) => {
                                e.target.src = '/dummy-image.jpg'; // Set fallback image path
                            }}
                        />
                    </div>
                    <div className="flex-1 p-4">
                        <h2 className="text-base font-semibold md:text-xl">{vendorData?.name}</h2>

                        <div className="mt-2 space-y-2 text-base text-gray-700">
                            <p>
                                <strong>Email : </strong>
                                {vendorData?.email}
                            </p>
                            <p>
                                <strong>Phone Number : </strong>
                                {vendorData?.phone_number}
                            </p>
                            <p>
                                <strong>Joined Date : </strong>
                                {moment(vendorData?.joined_date).format('LLL')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-2">
                    {/* BIo  */}
            {/* <h1 className="px-2 text-base font-semibold uppercase text-black">Bio</h1>
                    <p className="mt-4 px-2 text-justify text-lg">{vendorData?.about_company}</p>
                </div>
            </div> */}
            <div className="my-4 w-full bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <Heading title={'Stores'} />
                    <h2 onClick={handleOpenModal} className="flex cursor-pointer items-center justify-center gap-2 text-xl text-blue-600">
                        <PlusCircle size={24} /> Create new store
                    </h2>
                </div>

                {vendorData?.stores?.length > 0 ? (
                    <div className="plait mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {vendorData?.stores?.map((store: any) => (
                            <div className="w-[300px] rounded-md border">
                                <img
                                    src={`${process.env.ADMINURL}/upload/storeMedia/${store.banner_url}`}
                                    onError={(e) => {
                                        e.target.src = '/dummy-image.jpg'; // Set fallback image path
                                    }}
                                    alt=""
                                    className="h-[200px] w-full rounded-t-md object-cover"
                                />

                                <div className="p-4">
                                    <h1 className="inline-flex items-center text-lg font-semibold">{store.store_name}</h1>
                                    <p className="mt-3 text-sm text-gray-600">{store?.description}</p>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => handleOpenModal(store)}
                                            type="button"
                                            className="mt-4 flex w-full justify-center gap-2 rounded-sm  border border-slate-900 px-2 py-4 text-sm font-semibold text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                        >
                                            Edit &nbsp; <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-4 flex w-full justify-center gap-2 rounded-sm bg-black px-2 py-4 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                        >
                                            Visit Shop &nbsp; <ArrowUpRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    renderNOFound()
                )}
            </div>

            <ManageStoreModal form={form} selectedRow={selectedRow} visible={isModalOpen} onsubmit={handleSubmit} onClose={handleCloseModal} submitting={submitting} />
        </div>
    );
};

export default ViewVendor;
