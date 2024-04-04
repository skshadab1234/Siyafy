"use client"

import DocxBreadcrumbHeader from '@/components/layouts/DocxBreadcrumbHeader';
import { checkStoreExists } from '@/components/utils/checkStoreExists';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Docs = ({ params }: { params: { store: string } }) => {
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
            <DocxBreadcrumbHeader link={`/vendor/${params.store}/docs`} />
            <h1>Docs</h1>
        </div>
    );
};

export default Docs;
