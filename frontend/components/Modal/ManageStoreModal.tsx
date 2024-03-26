import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, Upload, Image, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ManageStoreModal = ({ visible, onClose, onsubmit, submitting, form, selectedRow }: any) => {
    const [fileList, setFileList] = useState([]);
    const [bannerfileList, setBannerFileList] = useState([]);

    useEffect(() => {
        if (selectedRow) {
            form.setFieldsValue(selectedRow);
        }
    }, [selectedRow]);
    
    const handleBeforeUpload = (file) => {
        // Check file type and size before uploading
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        // If both conditions are met, add the file to the fileList
        if (isImage) {
            setFileList([file]);
        }

        return false; // Prevent automatic upload
    };

    const handleBeforeUploadBanner = (file) => {
        // Check file type and size before uploading
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        // If both conditions are met, add the file to the fileList
        if (isImage) {
            setBannerFileList([file]);
        }

        return false; // Prevent automatic upload
    };

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                setFileList([]);
                setBannerFileList([]);
                onsubmit(values);
            })
            .catch((errorInfo) => {
                console.log('Form validation failed:', errorInfo);
            });
    };

    return (
        <Modal
            title={<h1 className="mb-10 text-2xl tracking-wide text-gray-600">Add new store</h1>}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="" className="bg-blue-500 text-white" onClick={handleSubmit} loading={submitting}>
                    Submit
                </Button>,
            ]}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item name="store_name" label="Store Name" rules={[{ required: true, message: 'Please enter store name' }]}>
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="address" label="Address">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="city" label="City">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="state" label="State">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="country" label="Country">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="phone" label="Phone">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="Email">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="website" label="Website">
                            <Input style={{ height: '50px' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="status" label="Status">
                            <Switch className="bg-gray-500" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea style={{ height: '100px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item name="logo_url" label="Store logo">
                            <Upload name="logo_url" accept=".jpg,.png" beforeUpload={handleBeforeUpload} fileList={fileList} onRemove={() => setFileList([])} listType="picture">
                                {fileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={16}>
                        <Form.Item name="banner_url" label="Banner">
                            <Upload name="banner_url" accept=".jpg,.png" beforeUpload={handleBeforeUploadBanner} fileList={bannerfileList} onRemove={() => setBannerFileList([])} listType="picture">
                                {bannerfileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ManageStoreModal;
