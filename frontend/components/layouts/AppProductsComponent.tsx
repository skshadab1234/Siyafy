import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, MenuProps, message, Space, Steps, theme } from 'antd';
import ProductInfo from '../ProductUploading/ProductInfo';
import ManageStock from '../ProductUploading/ManageStock';
import LinkedProducts from '../ProductUploading/LinkedProducts';

const AppProductsComponent = () => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const items: MenuProps['items'] = [
        {
            label: 'Draft',
            key: '1',
        },
        {
            label: 'Publish',
            key: '3',
        },
    ];

    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: 'Product Information',
            content: <ProductInfo form={form} />,
        },
        {
            title: 'Manage Stock',
            content: <ManageStock form={form} />,
        },
        {
            title: 'Link Products',
            content: <LinkedProducts form={form} />,
        },
        {
            title: 'Setting',
            content: <h1>HEllo</h1>,
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const itemsState = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const onClick: MenuProps['onClick'] = ({ key }) => {
        message.info(`Click on item ${key}`);
    };

    const handleNext = () => {
        form.validateFields().then((values) => {
            setFormValues({ ...formValues, ...values }); // Append new values to existing formValues
            next();
            // next() // If you want to call next function after updating formValues
        });
    };

    return (
        <div>
            <Steps onChange={(value) => setCurrent(value)} current={current} items={itemsState} />
            <div className="py-5">{steps[current].content}</div>
            <div className="fixed bottom-0 flex w-full justify-end gap-4 border-t px-10 py-5">
                {current > 0 && (
                    <Button className="flex h-10 items-center justify-center  rounded-md px-10 py-2 text-lg" onClick={() => prev()}>
                        Previous
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <div className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-white">
                        <Dropdown
                            menu={{
                                items,
                                onClick,
                            }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    Save as
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                )}
                {current < steps.length - 1 && (
                    <Button className="flex h-10 items-center justify-center rounded-md bg-blue-600 px-10 py-2 text-lg text-white" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AppProductsComponent;
