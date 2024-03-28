import Link from 'next/link';
import React from 'react';
import IconArrowBackward from '../icon/icon-arrow-backward';
import { useParams } from 'next/navigation';

const DocxBreadcrumbHeader = () => {
    const { store } = useParams();
    return (
        <div>
            <Link href={`/vendor/${store}`} className='flex gap-2 i items-center w-full'>
                <p className='text-xl flex  gap-2 items-center font-semibold'><IconArrowBackward className='w-8 h-8' /> Back to Store</p>
            </Link>
        </div>
    );
};

export default DocxBreadcrumbHeader;
