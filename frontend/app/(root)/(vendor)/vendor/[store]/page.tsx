"use client"
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Store = ({ params }: { params: { store: string } }) => {
    const vendorData = useSelector((state: IRootState) => state.vendor);
    const router = useRouter();
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [storeExists, setStoreExists] = useState(false); // State to manage store existence

    const checkStoreExists = async () => {
        try {
            const res = await fetch(`${process.env.ADMINURL}/api/checkStoreExists/${vendorData?.id}/${params.store}`);
            if (res.ok) {
                const data = await res.json();
                if (!data.success) {
                    // Store does not exist, redirect to /vendor
                    router.push('/vendor');
                } else {
                    // Store exists
                    setStoreExists(true);
                }
            } else {
                // Handle server error
                console.error('Server error:', res.statusText);
            }
        } catch (error) {
            // Handle fetch error
            console.error('Fetch error:', error);
        } finally {
            // Set loading to false once the request is completed
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vendorData && vendorData.id) {
            checkStoreExists();
        }
    }, [vendorData]);

    return (
        <div>
            {loading && <div>Loading...</div>} {/* Display loading indicator while waiting for response */}
            {!loading && storeExists && <h1>{params.store}</h1>} {/* Display store name if it exists */}
        </div>
    );
};

export default Store;
