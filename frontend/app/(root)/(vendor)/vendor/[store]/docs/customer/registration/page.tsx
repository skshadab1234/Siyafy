'use client';

import { checkStoreExists } from '@/components/utils/checkStoreExists';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import DocxBreadcrumbHeader from '@/components/layouts/DocxBreadcrumbHeader';

const CustomerRegistration = ({ params }: { params: { store: string } }) => {
    const vendorData = useSelector((state: IRootState) => state.vendor);
    const router = useRouter();

    useEffect(() => {
        if (vendorData?.id && params.store) {
            checkStoreExists(vendorData.id, params.store).then((storeExists) => {

                if (!storeExists?.success) {
                    router.push('/vendor');
                    return;
                }
            });
        }
    }, [vendorData, params]);

    return (
        <div>
            <DocxBreadcrumbHeader
                items={[
                    {
                        title: <Link href="/vendor">Home</Link>,
                    },
                    {
                        title: 'Customer Registration',
                    },
                ]}
            />
            <div className="container mx-auto mt-5">
                <h1 className="text-lg font-semibold md:text-2xl">Customer Registration</h1>
                <p className="mt-2 text-sm text-gray-600">Welcome to the customer registration page. To register a customer for a specific vendor and store, please follow these steps:</p>
                <ol className="ml-6 mt-2 list-decimal">
                    <li>Ensure you are logged in as an authorized user for the vendor account.</li>
                    <li>Select the appropriate vendor and store for which you want to register the customer.</li>
                    <li>Fill out the customer registration form with accurate information.</li>
                    <li>Upload the customer's profile picture (if required).</li>
                    <li>Review the entered details and ensure all information is correct.</li>
                    <li>Click on the "Create Account" button to complete the registration process.</li>
                </ol>
                <p className="mt-2 text-sm text-gray-600">
                    Following these steps will ensure successful registration of the customer in the specified vendor's store. If you encounter any issues during the registration process, please
                    contact the administrator for assistance.
                </p>
            </div>
        </div>
    );
};

export default CustomerRegistration;
