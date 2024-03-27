'use client';
import { checkStoreExists } from '@/components/utils/checkStoreExists';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Store = ({ params }: { params: { store: string } }) => {
    const vendorData = useSelector((state: IRootState) => state.vendor);
    const router = useRouter();
    useEffect(() => {
        if (vendorData?.id && params.store) {
            checkStoreExists(vendorData.id, params.store).then((storeExists) => {
                console.log(storeExists);

                if (!storeExists?.success) {
                    router.push('/');
                    return
                }
            });
        }
    }, [vendorData, params]);
   
    return <div>asdasd</div>;
};

export default Store;
