import Link from 'next/link';
import React from 'react';
import IconArrowBackward from '../icon/icon-arrow-backward';
import { useParams } from 'next/navigation';
import { Breadcrumb } from 'antd';

const DocxBreadcrumbHeader = ({items}: any) => {
    const { store } = useParams();
    console.log(items);
    
    return (
        <div>
            <Breadcrumb items={items} />
            <Link href={`/vendor/${store}`} className="i flex w-full items-center gap-2">
                <p className="flex items-center  gap-2 text-xl font-semibold">
                    <IconArrowBackward className="h-8 w-8" /> Back to Store
                </p>
            </Link>
        </div>
    );
};

export default DocxBreadcrumbHeader;
