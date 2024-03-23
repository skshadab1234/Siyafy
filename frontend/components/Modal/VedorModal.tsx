import { Modal, Form, Input, Button, Switch, Select, Row, Col } from 'antd';
import React from 'react';

const { Option } = Select;

const VendorModal = ({ modalVisible, handleCancel, selectedKey, updatedValues, loader, form }) => {

    const onFinish = (values) => {
        updatedValues(values);
        // Handle form submission here, such as sending data to the backend
    };

    return (
        <Modal
            title={selectedKey ? 'Edit Vendor' : 'Add Vendor'}
            visible={modalVisible}
            onCancel={handleCancel}
            width={900}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button loading={loader} key="submit" type="" className='bg-green-500 text-white' onClick={() => form.submit()}>
                    Submit
                </Button>,
            ]}
        >
            
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={[16, 16]}>
                    {/* Left column */}
                    <Col span={12}>
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input the email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item
                            label="Phone Number"
                            name="phone_number"
                            rules={[
                                { required: true, message: 'Please input the phone number with country code' },
                                {
                                    pattern: /^\d{12}$/,
                                    message: 'Please enter a valid 10-digit phone number with country code',
                                },
                            ]}
                        >
                            <Input
                                placeholder="e.g., 1234567890"
                                style={{ height: '40px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Website URL"
                            name="website_url"
                            rules={[
                                { required: true, message: 'Please input the website URL!' },
                                {
                                    type: 'url',
                                    message: 'Please enter a valid URL starting with http:// or https://',
                                },
                            ]}
                        >
                            <Input style={{ height: '40px' }} />
                        </Form.Item>

                        <Form.Item label="About Company" name="about_company">
                            <Input.TextArea rows={10} style={{ height: '40px' }} />
                        </Form.Item>


                        <Form.Item label="Is Multiple Shop" name="is_multiple_shop" valuePropName="checked">
                            <Switch style={{ backgroundColor: '#323232' }} />
                        </Form.Item>
                        <Form.Item label="Vendor Status" name="vendor_status" rules={[{ required: true, message: 'Please select the vendor status!' }]}>
                            <Select style={{ width: '100%' }}>
                                <Option value={1}>Pending</Option>
                                <Option value={2}>Approved</Option>
                                <Option value={3}>Blocked</Option>
                                <Option value={4}>Rejected</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* Right column */}
                    <Col span={12}>
                        <Form.Item label="Address Line 1" name="head_office_address_line1" rules={[{ required: true, message: 'Please input the address line 1!' }]}>
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item label="Address Line 2" name="head_office_address_line2">
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item label="City" name="head_office_city" rules={[{ required: true, message: 'Please input the city!' }]}>
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item label="State" name="head_office_state" rules={[{ required: true, message: 'Please input the state!' }]}>
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item label="Country" name="head_office_country" rules={[{ required: true, message: 'Please input the country!' }]}>
                            <Input style={{ height: '40px' }} />
                        </Form.Item>
                        <Form.Item label="Zipcode" name="head_office_zipcode" rules={[{ required: true, message: 'Please input the zipcode!' }]}>
                            <Input style={{ height: '40px' }} />
                        </Form.Item>

                   
                        <Form.Item label="Contact Person name" name="contact_person_name">
                            <Input style={{ height: '40px' }} />
                        </Form.Item>

                        <Form.Item label="Contact Person Email" name="contact_person_email">
                            <Input style={{ height: '40px' }} />
                        </Form.Item>

                        <Form.Item label="Company name" name="company_name">
                            <Input style={{ height: '40px' }} />
                        </Form.Item>


                        <Form.Item label="Business type" name="business_type">
                            <Input style={{ height: '40px' }} />
                        </Form.Item>

                        <Form.Item label="Industry" name="industry">
                            <Input style={{ height: '40px' }} />
                        </Form.Item>

                    </Col>
                </Row>
                {/* Add more form items as needed */}
            </Form>
        </Modal>
    );
};

export default VendorModal;
