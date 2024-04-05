import AppProducts from '@/components/layouts/components-apps-products';
import { Form } from 'antd';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'All Products',
};

const Products = ({ params }: { params: { store: string } }) => {

    return <AppProducts store={params.store} />;
};

export default Products;
