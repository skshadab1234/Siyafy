import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, MenuProps, message, Space, Steps, theme } from 'antd';
import ProductInfo from '../ProductUploading/ProductInfo';
import ManageStock from '../ProductUploading/ManageStock';
import LinkedProducts from '../ProductUploading/LinkedProducts';
import ProductSetting from '../ProductUploading/ProductSetting';
import Swal from 'sweetalert2';
import { getCookie } from './header';

const AppProductsComponent = ({ selectedProduct, products, setProducts, productUpdateKEy, form, typeofProduct, setAddNewModal, store }: any) => {
    const [formValues, setFormValues] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);
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

    useEffect(() => {
        // First, reset the current value to null
        setSelectedKey(null);

        const timeoutId = setTimeout(() => {
            setSelectedKey(productUpdateKEy);
            setFormValues(selectedProduct);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [productUpdateKEy]); // Dependency array to re-run this effect when `productUpdateKey` changes.

    const [current, setCurrent] = useState(0);

    const handleSetLinked = (objSelcted: any) => {
        form.setFieldsValue(objSelcted);
        setFormValues({ ...formValues, ...objSelcted });
    };

    const steps = [
        {
            title: 'Product Information',
            content: <ProductInfo selectedProduct={selectedProduct} form={form} />,
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

    const onClick: MenuProps['onClick'] = async ({ key }) => {
        const typeofUpload = items.find((item) => item.key === key);
        // Assuming `values` needs to be obtained from somewhere, like form state.
        const values = form.getFieldsValue(); // This is an example. Adjust based on how you actually get form values.

        const metaDataArray = [];

        if (values.meta_description) {
            metaDataArray.push({ key: 'meta_description', value: values.meta_description });
        }
        if (values.meta_keywords) {
            metaDataArray.push({ key: 'meta_keywords', value: values.meta_keywords });
        }
        if (values.meta_title) {
            metaDataArray.push({ key: 'meta_title', value: values.meta_title });
        }

        // Use formData directly for both Draft and non-Draft, but only validate in non-Draft cases.
        const formData = { ...formValues, meta_data: [...metaDataArray], typeofUpload: typeofUpload?.label?.toLowerCase(), typeofProduct, ...values, store_name: store };

        if (typeofUpload?.label !== 'Draft') {
            // Non-Draft scenario: Validate fields and then proceed
            try {
                await form.validateFields();
                // Proceed with submission if needed
                if (selectedKey) {
                    // UPdate
                    console.log('UPdate');
                    const updatedData = await updateProduct(selectedKey, formData);
                    console.log(updatedData, 'updated row sas');

                    form.resetFields();
                    setCurrent(0);
                    setAddNewModal(false);
                    setFormValues(formData); // Update form values state
                } else {
                    const backendResponse = await processBackendLogic(formData);
                    if (backendResponse?.status) {
                        setSelectedKey(backendResponse?.data);
                    }
                    form.resetFields();
                    setCurrent(0);
                    setAddNewModal(false);
                    setFormValues(formData); // Update form values state
                }
            } catch (error) {
                // Handle validation errors
                console.log(error);
            }
        } else {
            // Draft scenario: Skip validation and proceed
            if (selectedKey) {
                // UPdate
                console.log('UPdate');
                await updateProduct(selectedKey, formData);
                form.resetFields();
                setCurrent(0);
                setAddNewModal(false);
                setFormValues(formData); // Update form values state
            } else {
                const backendResponse = await processBackendLogic(formData);
                if (backendResponse?.status) {
                    setSelectedKey(backendResponse?.data);
                }
                form.resetFields();
                setCurrent(0);
                setAddNewModal(false);
                setFormValues(formData); // Update form values state
            }
        }
    };

    const processBackendLogic = async (formData: any) => {
        try {
            // Get the authorization token
            const token = getCookie('tokenVendorsSagartech');

            // Construct the HTTP request headers
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            // Make the HTTP request to the backend API
            const response = await fetch(`${process.env.ADMINURL}/api/vendors/products/add`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData),
            });

            // Check the response status code
            if (response.status === 200) {
                // If successful (status code 200), show success message
                const data = await response.json();
                Swal.fire({
                    title: 'Success!',
                    text: data.message, // Assuming your backend returns a 'message' property in case of success
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
                return data;
            } else if (response.status === 400) {
                // If bad request (status code 400), show error message
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error!',
                    text: errorData.error, // Assuming your backend returns an 'error' property in case of error
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
                return errorData;
            } else {
                // If any other status code (e.g., 500), show generic error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add product. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
                return { status: false };
            }
        } catch (error) {
            // Handle any errors that occur during the process
            console.log(error);
            // Show generic error message
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add product. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            throw error; // Rethrow the error so it can be caught by the caller if needed
        }
    };

    const updateProduct = async (id, formData) => {
        try {
            // Assuming formData.images is an array of File/Blob objects
            const images = formData.images || [];
            const bodyFormData = new FormData();

            // Append each image to the FormData
            images.forEach((image, index) => {
                console.log(image?.originFileObj, 'i');

                bodyFormData.append(`images`, image?.originFileObj);
            });

            bodyFormData.append(`formData`, JSON.stringify(formData));

            // Append other formData properties to FormData if needed
            // Example: bodyFormData.append('name', formData.name);

            const token = getCookie('tokenVendorsSagartech');

            // Note: 'Content-Type': 'multipart/form-data' will be automatically set by the browser
            // when you pass a FormData object to fetch. You don't need to explicitly set it.
            const response = await fetch(`${process.env.ADMINURL}/api/vendors/products/update/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: bodyFormData,
            });

            if (response.status === 200) {
                const data = await response.json();
                Swal.fire({
                    title: 'Success!',
                    text: 'Product updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                return data;
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                throw new Error(errorMessage);
            } else {
                throw new Error('Failed to update product. Please try again later.');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleNext = () => {
        form.validateFields().then((values) => {
            setFormValues({ ...formValues, ...values }); // Append new values to existing formValues
            next();
            // next() // If you want to call next function after updating formValues
        });
    };

    console.log(formValues, 'FormValues');

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
