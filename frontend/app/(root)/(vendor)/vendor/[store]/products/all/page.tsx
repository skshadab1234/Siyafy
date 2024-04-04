import AppProducts from '@/components/layouts/components-apps-products';
import { Form } from 'antd';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'All Products',
};

const Notes = () => {

    return <AppProducts />;
};

export default Notes;
