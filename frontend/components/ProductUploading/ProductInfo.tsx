import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Upload, Button, List, Modal, Image, Input, Switch, DatePicker, Divider } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { slugify } from '@/utils';
import { Trash2Icon } from 'lucide-react';

const ProductInfo = ({ form, selectedProduct }) => {
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [value, setValue] = useState('');
    const [regularPrice, setRegularPrice] = useState(0);
    const [isOnSale, setIsOnSale] = useState(false);

    const [updatedImages, setUpdatedImages] = useState(selectedProduct?.back_images);
    useEffect(() => {
        setUpdatedImages(updatedImages);
    }, []);

    const handleUploadChange = ({ fileList: newFileList }) => {
        // Automatically generate preview URLs for image files
        newFileList = newFileList.map((file) => {
            if (!file.url && !file.preview) {
                file.preview = URL.createObjectURL(file.originFileObj);
            }
            return file;
        });

        setFileList(newFileList);
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewVisible(false);

    const validateProductName = (_, value) => {
        if (!value) {
            return Promise.reject('Product name is required.');
        }

        // Split the input value into words
        const words = value.trim().split(/\s+/);

        // Check each word for length
        for (const word of words) {
            if (word.length > 20) {
                return Promise.reject('Each word cannot exceed 20 characters.');
            }
        }

        // Check total word count
        if (words.length > 100) {
            return Promise.reject('Product name cannot exceed 100 words.');
        }

        return Promise.resolve();
    };

    const handleProductNameChange = (e) => {
        const productName = e.target.value;
        const slug = slugify(productName);
        form.setFieldsValue({ slug });
    };

    const handleRegularPriceChange = (e) => {
        const { value } = e.target;
        if (!isNaN(value)) {
            setRegularPrice(value);
            form.setFieldsValue({ discount: '' }); // Reset discount when regular price changes
        }
    };

    const handlePriceChange = (e) => {
        const { value } = e.target;
        if (!isNaN(value)) {
            form.setFieldsValue({ discount: '' }); // Reset discount when regular price changes
            const sellingPrice = parseFloat(value);
            const mrpPrice = parseFloat(regularPrice);
            if (sellingPrice >= mrpPrice) {
                form.setFieldsValue({ price: mrpPrice }); // Set selling price to MRP price if it's greater
            } else {
                calculateDiscount(sellingPrice, mrpPrice);
            }
        }
    };

    const calculateDiscount = (price, regularPrice) => {
        const discount = regularPrice - price;
        const percentage = ((discount / regularPrice) * 100).toFixed(2);
        const discountString = `(${percentage}%)`;
        form.setFieldsValue({ discount: discountString });
    };

    const handleSwitchChange = (checked) => {
        setIsOnSale(checked);
        if (!checked) {
            // Reset sale price, start date, and end date if product is not on sale
            form.setFieldsValue({
                sale_price: '',
                start_date: undefined,
                end_date: undefined,
            });
        }
    };

    const handleDelete = (image: string) => {
        if (selectedProduct) {
            const index = selectedProduct.back_images.indexOf(image);
            console.log(index, 'index to update');

            if (index !== -1) {
                const updatedBackImages = [...selectedProduct.back_images];
                updatedBackImages.splice(index, 1);

                console.log(updatedBackImages);

                // Update the selectedProduct state with the new array
                setUpdatedImages(updatedBackImages);
            }
        }
    };

    return (
        <div className="mb-10">
            <h1>Uploaded Medias</h1>
            <div className="flex flex-wrap gap-4">
                {updatedImages.map((item, index) => (
                    <div key={index} className="relative">
                        <Image className="aspect-3/2 h-12 object-cover shadow-lg" width={100} src={`${process.env.ADMINURL}/upload/vendorProducts/${item}`} alt={item.alt} style={{ width: '100%' }} />
                        <button
                            className="absolute right-2 top-2 rounded bg-red-500 p-2 text-white"
                            onClick={() => handleDelete(item)} // Assuming handleDeleteImage is your delete image function
                        >
                            <Trash2Icon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="images"
                            label="Upload Media"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e?.fileList;
                            }}
                            extra="Select up to 10 media files."
                        >
                            <Upload
                                name="images"
                                listType="picture-card"
                                maxCount={10}
                                multiple
                                beforeUpload={() => false} // Prevent upload
                                onChange={handleUploadChange}
                                onPreview={handlePreview}
                                accept=".png,.jpg,.webp" // Accept only PNG, JPG, and WEBP files
                            >
                                {fileList.length < 10 && '+ Upload'}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Product Name" name="name" extra="Title should be a maximum of 100 words." rules={[{ required: true, validator: validateProductName }]}>
                            <Input className="h-12" onChange={handleProductNameChange} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Product Slug" name="slug">
                            <Input className="h-12 disabled:text-black" disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="SKU" name="sku" extra="Example: ABC123" rules={[{ required: true, message: 'SKU is required' }]}>
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Short Description"
                    name="short_description"
                    extra="Brief description of the product (max 250 characters)."
                    rules={[
                        { required: true, message: 'Short description is required.' },
                        { max: 250, message: 'Short description cannot exceed 250 characters.' },
                    ]}
                >
                    <Input.TextArea rows={4} maxLength={250} />
                </Form.Item>

                {/* Long Description */}
                <Form.Item label="Long Description" name="description" extra="Detailed description of the product." rules={[{ required: true, message: 'Long description is required.' }]}>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        modules={{
                            toolbar: {
                                container: [
                                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                                    ['blockquote', 'code-block'],
                                    [{ header: 1 }, { header: 2 }], // custom button values
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                                    [{ direction: 'rtl' }], // text direction
                                    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                                    [{ font: [] }],
                                    [{ align: [] }],
                                    ['link', 'image', 'video'],
                                    ['clean'], // remove formatting button
                                ],
                            },
                        }}
                        onChange={(value) => form.setFieldsValue({ description: value })}
                    />
                </Form.Item>

                <Divider className="my-10 h-1 bg-gray-400" />

                <Row gutter={16}>
                    {/* Regular Price */}
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Mrp Price" initialValue={0} name="regular_price" rules={[{ required: true, message: 'Mrp Price is required' }]}>
                            <Input type="number" className="h-12" onChange={handleRegularPriceChange} />
                        </Form.Item>
                    </Col>

                    {/* Price */}
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Sell Price" initialValue={0} name="price" rules={[{ required: true, message: 'Sell Price is required' }]}>
                            <Input type="number" defaultValue={0} className="h-12" onChange={handlePriceChange} />
                        </Form.Item>
                    </Col>

                    {/* Discount */}
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Discount" name="discount">
                            <Input type="text" className="h-12 disabled:text-black" disabled />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Product Weight" initialValue={0} name="weight" rules={[{ required: true, message: '' }]} extra="weight should in gram">
                            <Input type="number" defaultValue={0} className="h-12" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Product Width" initialValue={0} name="width" rules={[{ required: true, message: '' }]} extra="width should in cm">
                            <Input type="number" defaultValue={0} className="h-12" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Product Height" initialValue={0} name="height" rules={[{ required: true, message: '' }]} extra="height should in cm">
                            <Input type="number" defaultValue={0} className="h-12" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="Product Length" initialValue={0} name="length" rules={[{ required: true, message: '' }]} extra="length should in cm">
                            <Input type="number" defaultValue={0} className="h-12" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8}>
                        <Form.Item label="On Sale" name="on_sale" valuePropName="checked">
                            <Switch className="bg-gray-500" onChange={handleSwitchChange} />
                        </Form.Item>
                    </Col>

                    {isOnSale && (
                        <>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item label="Sale Price" name="sale_price" rules={[{ required: true, message: 'Sale Price is required' }]}>
                                    <Input type="number" className="h-12" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item label="Start Date" name="start_date" rules={[{ required: true, message: 'Start Date is required' }]}>
                                    <DatePicker format="YYYY-MM-DD" className="w-full" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Form.Item label="End Date" name="end_date" rules={[{ required: true, message: 'End Date is required' }]}>
                                    <DatePicker format="YYYY-MM-DD" className="w-full" />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>
            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <Image alt="example" style={{ width: '100vw' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default ProductInfo;
