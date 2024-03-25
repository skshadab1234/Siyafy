'use client';

import { Adminurl } from '@/app/layout';
import Heading from '@/components/Heading';
import ManageStoreModal from '@/components/Modal/ManageStoreModal';
import { getCookie } from '@/components/layouts/header';
import { Button, Form } from 'antd';
import { ArrowUpRight, Dot, MessageCircle, PencilIcon, PhoneCallIcon, PlusCircle } from 'lucide-react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface VendorData {
    vendor_image: string;
    name: string;
    about_company: string;
    email: string;
    phone_number: string;
    joined_date: string;
    stores: Store[];
}

interface Store {
    store_name: string;
    description: string;
    banner_url: string;
}

const ViewVendor = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [form] = Form.useForm();
    const [vendorData, setVendorData] = useState<VendorData | null>(null);
    const [selectedRow, setSelectedRow] = useState<Store | null>(null);
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

    const handleOpenModal = (store = null) => {
        console.log(store, 'store');
        form.resetFields();
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

        // Check if logo file exists before appending
        if (value?.logo_url) {
            formData.append('file', value.logo_url.file);
        }

        // Check if banner file exists before appending
        if (value?.banner_url) {
            formData.append('file', value.banner_url.file);
        }

        // Determine the API endpoint based on whether it's an add or edit operation
        const apiUrl = `${process.env.ADMINURL}/api/vendors/store/add`;

        // Determine the HTTP method based on whether it's an add or edit operation

        fetch(apiUrl, {
            method: 'POST',
            body: formData,
        })
            .then(async (response) => {
                if (response.status === 400) {
                    const data = await response.json();

                    console.log(data);

                    showMessage(data.error, 'error');
                    return;
                }
                if (response.ok) {
                    // Handle success
                    const data = await response.json();
                    console.log(data);
                    setSubmitting(false);
                    showMessage(selectedRow ? 'Store updated successfully' : 'Store added successfully');

                    // Check if vendorData.stores exists or initialize it with an empty array
                    const updatedStores = vendorData.stores ? [...vendorData.stores] : [];

                    // Update the stores array based on whether it's an add or edit operation
                    if (selectedRow) {
                        const index = updatedStores.findIndex((store) => store.store_id === data.data.store_id);
                        if (index !== -1) {
                            updatedStores[index] = data.data;
                        }
                    } else {
                        updatedStores.push(data.data);
                    }

                    // Update vendorData with the updated stores array
                    setVendorData({ ...vendorData, stores: updatedStores });

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
                    <Button onClick={() => handleOpenModal(null)} className="flex h-20 w-full items-center justify-center gap-2 rounded-full bg-black p-4 text-xl text-white">
                        <PlusCircle size={24} /> Create new store
                    </Button>
                </div>
            </div>
        );
    };

    const renderSkeleton = () => {
        const skeletons = Array(10).fill(0); // Create an array of 10 elements

        return (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {skeletons.map((_, index) => (
                    <div key={index} className="space-y-3">
                        <div className="h-36 w-full animate-pulse bg-gray-300"></div>
                        <div className="mt-3 h-4 w-1/2 animate-pulse bg-gray-300"></div>
                    </div>
                ))}
            </div>
        );
    };

    const openLink = (link) => {
        // Step 1: Validate the link
        const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        if (!urlPattern.test(link)) {
            alert('Invalid link'); // Show an alert instead of logging to the console
            return;
        }
    
        // Step 2: Check if the link exists (simplified as checking if it's a valid URL)
        // Since checking if a link exists without making a request is complex and beyond the scope of this example,
        // we'll assume the link exists if it's a valid URL.
    
        // Step 3: Open the link in a new tab
        window.open(link, '_blank');
    };
    return (
        <div>
            <div className=" items-center gap-4 bg-white dark:bg-slate-900  p-4 shadow-md  md:flex">
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
                <div className="w-full justify-between md:flex ">
                    <div className="md:w-1/2">
                        <h2 className="text-base font-semibold md:text-xl">{vendorData?.name}</h2>
                        {vendorData?.about_company && <p className="text-gray-700 dark:text-gray-300 md:w-3/4">{vendorData?.about_company}</p>}
                    </div>
                    <div className="mt-5 flex flex-col space-y-2 md:mt-0">
                        <p className="inline-block text-lg">{vendorData?.email}</p>
                        <p className="inline-block">{vendorData?.phone_number}</p>
                        <p className="inline-block">{moment(vendorData?.joined_date).format('LLL')}</p>
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
            <div className="my-4 w-full bg-white dark:bg-slate-900 p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <Heading title={`Stores (${vendorData?.stores?.length})`} />
                    <h2 onClick={() => handleOpenModal(null)} className="flex cursor-pointer items-center justify-center gap-2 text-xl text-blue-600">
                        <PlusCircle size={24} /> Create new store
                    </h2>
                </div>

                {!vendorData ? (
                    renderSkeleton()
                ) : vendorData?.stores?.length > 0 ? (
                    <div className="plait mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {vendorData?.stores?.map((store: any) => (
                            <div className=" rounded-md border dark:border-slate-700">
                                <img
                                    src={`${process.env.ADMINURL}/upload/storeMedia/${store.banner_url}`}
                                    onError={(e) => {
                                        e.target.src = '/banner-placeholder.png'; // Set fallback image path
                                    }}
                                    alt=""
                                    className="h-[200px] w-full rounded-t-md object-cover"
                                />

                                <div className="">
                                    <div className='p-4'>
                                        <div className="flex items-center justify-between">
                                            <div className="line-clamp-1 inline-flex w-1/2 items-center text-lg font-semibold ">{store.store_name}</div>

                                            <div className="flex items-center justify-center">
                                                <Dot className={`${store.status === 0 ? 'text-red-500' : 'text-green-500'}`} />
                                                {store.status === 0 ? <p className="text-red-500">Not Approved</p> : <p className="text-green-500">Active</p>}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-600">{store?.description}</p>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 px-2">
                                        <button
                                            onClick={() => handleOpenModal(store)}
                                            type="button"
                                            className="mt-4 flex w-full items-center justify-center gap-2 py-2  rounded-sm border dark:border-slate-600 px-2 text-sm font-semibold dark:text-white text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                        >
                                            Edit &nbsp; <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openLink(store.website)}
                                            className="mt-4 flex w-full items-center justify-center gap-2 py-2 rounded-sm dark:bg-slate-600 bg-black px-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black group"
                                        >
                                            Visit Shop &nbsp; <ArrowUpRight className="h-4 w-4 group-hover:scale-110" />
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
