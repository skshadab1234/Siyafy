import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, MenuProps, message, Space, Steps, theme } from 'antd';
import ProductInfo from '../ProductUploading/ProductInfo';
import ManageStock from '../ProductUploading/ManageStock';
import LinkedProducts from '../ProductUploading/LinkedProducts';
import ProductSetting from '../ProductUploading/ProductSetting';

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

    const handleSetLinked = (objSelcted: any) => {
        form.setFieldsValue(objSelcted);
        setFormValues({ ...formValues, ...objSelcted });
    };

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
            content: <LinkedProducts form={form} onReturn={handleSetLinked} />,
        },
        {
            title: 'Setting',
            content: <ProductSetting form={form} />,
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
        form.validateFields().then((values) => {
            const metaDataArray = [];
            // Check if meta_description exists and push it to the metaDataArray
            if (values.meta_description) {
                metaDataArray.push({ key: 'meta_description', value: values.meta_description });
            }
            // Check if meta_keywords exists and push it to the metaDataArray
            if (values.meta_keywords) {
                metaDataArray.push({ key: 'meta_keywords', value: values.meta_keywords });
            }
            // Check if meta_title exists and push it to the metaDataArray
            if (values.meta_title) {
                metaDataArray.push({ key: 'meta_title', value: values.meta_title });
            }
            // Append metaDataArray to the existing formValues
            setFormValues({ ...formValues, metaData: [...metaDataArray] });
        });
    };

    const handleNext = () => {
        form.validateFields().then((values) => {
            setFormValues({ ...formValues, ...values }); // Append new values to existing formValues
            next();
            // next() // If you want to call next function after updating formValues
        });
    };

    console.log(formValues, 'form');
    
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
