import { Form, Input, Button, Modal, DatePicker, Select, Upload } from 'antd';
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CustomerForm = ({ modalVisible, onCancel, onsubmit, loading, form }: { modalVisible: boolean; onCancel: () => void, onsubmit: any, loading: boolean, form: any }) => {
    const [fileList, setFileList] = useState([]);

    const handleBeforeUpload = (file) => {
        // Check file type and size before uploading
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';

        // If both conditions are met, add the file to the fileList
        if (isImage) {
            setFileList([file]);
        }

        return false; // Prevent automatic upload
    };

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                setFileList([]);
                onsubmit(values);
            })
            .catch((errorInfo) => {
                console.log('Form validation failed:', errorInfo);
            });
    };

    return (
        <Modal title="Create New Customer" visible={modalVisible} onCancel={onCancel} footer={null}>
            <Form form={form} name="customer_form" onFinish={handleSubmit} layout="vertical" className='mt-10'>
                <Form.Item name="customer_media" label="Customer Profile">
                    <Upload name="customer_media" accept=".jpg,.png" beforeUpload={handleBeforeUpload} fileList={fileList} onRemove={() => setFileList([])} listType="picture">
                        {fileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                    </Upload>
                </Form.Item>
                <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: 'Please input the first name!' }]}>
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Last Name" name="last_name" rules={[{ required: true, message: 'Please input the last name!' }]}>
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Phone" name="phone">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Country" name="address_country">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Company" name="address_company">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Address Line 1" name="address_line1">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Address Line 2" name="address_line2">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="City" name="city">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="State" name="state">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Pin Code" name="pin_code">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Phone Number Address" name="phone_number_address">
                    <Input className="h-12" />
                </Form.Item>

                <Form.Item label="Note" name="note">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Collect Taxes" initialValue={false} name="collect_taxes" valuePropName="checked">
                    <Select defaultValue={false}>
                        <Option value={true}>Yes</Option>
                        <Option value={false}>No</Option>
                    </Select>
                </Form.Item>

                <Form.Item className="flex justify-end gap-4">
                    <Button htmlType="button" onClick={onCancel} style={{ marginLeft: '8px' }}>
                        Cancel
                    </Button>

                    <Button loading={loading} htmlType="submit" className="ml-4">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomerForm;
