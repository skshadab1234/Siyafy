import { Form, Input, Button, Modal, DatePicker, Select, Upload, Switch, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';

import { Option } from 'antd/es/mentions';

const CustomerForm = ({
    modalVisible,
    onCancel,
    onsubmit,
    loading,
    form,
    selectedCountrydata,
}: {
    modalVisible: boolean;
    onCancel: () => void;
    onsubmit: any;
    loading: boolean;
    form: any;
    selectedCountrydata: any;
}) => {
    const [fileList, setFileList] = useState([]);
    const [statesList, setStates] = useState<IState[]>([]); // Explicitly define the type here
    const [cityList, setCity] = useState<ICity[]>([]); // Explicitly define the type here
    const [selectedCountry, setSelectedCountry] = useState<ICountry[]>(selectedCountrydata); // Explicitly define the
    const countryList = Country.getAllCountries();

    useEffect(() => {
        setSelectedCountry(selectedCountrydata);
        const states = State.getStatesOfCountry(selectedCountrydata?.isoCode) || [];
        setStates(states);
        console.log(states?.[0]?.countryCode, selectedCountrydata);

        const cities = City.getCitiesOfState(states?.[0]?.countryCode, selectedCountrydata?.name);
        console.log(cities);

        setCity(cities);
    }, [selectedCountrydata]);

    const handleChangeCountry = (value, option) => {
        const selectedCountry = option?.data; // Access the data property of the selected option
        setSelectedCountry(selectedCountry);
        const states = State.getStatesOfCountry(selectedCountry?.isoCode);
        setStates(states);
        form.setFieldsValue({ state: undefined, city: undefined }); // Adjust field names as necessary
        // Perform any necessary actions with the selected country object
    };

    const handleChangeState = (value, option) => {
        const selectedState = option?.data; // Access the data property of the selected option
        const cities = City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode);
        setCity(cities);
        form.setFieldsValue({ city: undefined }); // Adjust field names as necessary
    };

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
                onsubmit({ ...values, selectedCountry });
            })
            .catch((errorInfo) => {
                console.log('Form validation failed:', errorInfo);
            });
    };

    return (
        <Modal width={1200} title={<h1 className="text-xl md:text-2xl">Create New Customer</h1>} visible={modalVisible} onCancel={onCancel} footer={null}>
            <Form form={form} name="customer_form" onFinish={handleSubmit} layout="vertical" className="mt-10">
                <Form.Item name="customer_media" label="Upload Profile">
                    <Upload fileList={fileList} listType="picture" name="customer_media" accept=".jpg,.png" beforeUpload={handleBeforeUpload} onRemove={() => setFileList([])}>
                        {fileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                    </Upload>
                </Form.Item>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item label="First Name" name="first_name" rules={[{ required: true, whitespace: true, message: 'Please input the first name!' }]}>
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name" name="last_name" rules={[{ required: true, whitespace: true, message: 'Please input the last name!' }]}>
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, whitespace: true, type: 'email', message: 'Please input a valid email!' }]}>
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Company" name="address_company">
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item label="Address Line 1" name="address_line1">
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Address Line 2" name="address_line2">
                            <Input className="h-12" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label="Country"
                            name="address_country"
                            rules={[{ required: true, message: 'Please select a country!' }]} // Adding required rule
                            className="h-12"
                            style={{ width: '100%' }}
                        >
                            <Select showSearch className="h-12" allowClear onChange={handleChangeCountry}>
                                {countryList.map((country, index) => (
                                    <Option key={index} value={country.name} data={country}>
                                        {country.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="State" name="state">
                            <Select showSearch allowClear className="h-12" style={{ width: '100%' }} onChange={handleChangeState}>
                                {statesList.map((state) => (
                                    <Option key={state.isoCode} value={state.name} data={state}>
                                        {state.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item label="City" name="city">
                            <Select showSearch allowClear className="h-12" style={{ width: '100%' }}>
                                {cityList.map((city) => (
                                    <Option key={city.stateCode} value={city.name} data={city}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                        <Form.Item label="Pin Code" name="pin_code">
                            <Input className="h-12" />
                        </Form.Item>
                    </Col> */}
                </Row>

                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    pattern: /^\+?[0-9\s-]+$/,
                                    message: 'Please enter a valid phone number.',
                                },
                                {
                                    validator: (_, value) => {
                                        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
                                        if (numericValue.length >= 8 && numericValue.length <= 15) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Phone number must be between 8 to 15 digits.'));
                                    },
                                },
                            ]}
                        >
                            <Input
                                addonBefore={
                                    selectedCountry ? (
                                        <h1>
                                            {selectedCountry?.flag} {selectedCountry?.phonecode}
                                        </h1>
                                    ) : null
                                }
                                className="h-12"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Alternate Phone Number"
                            name="phone_number_address"
                            rules={[
                                {
                                    pattern: /^\+?[0-9\s-]+$/,
                                    message: 'Please enter a valid phone number.',
                                },
                                {
                                    validator: (_, value) => {
                                        const numericValue = value ? value.replace(/\D/g, '') : ''; // Remove non-numeric characters, handle undefined/null
                                        if (numericValue.length >= 8 && numericValue.length <= 15) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Alternate phone number must be between 8 to 15 digits.'));
                                    },
                                },
                            ]}
                        >
                            <Input
                                addonBefore={
                                    selectedCountry ? (
                                        <h1>
                                            {selectedCountry?.flag} {selectedCountry?.phonecode}
                                        </h1>
                                    ) : null
                                }
                                className="h-12"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Note" name="note">
                    <Input.TextArea cols={5} />
                </Form.Item>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item label="Collect Taxes" initialValue={false} name="collect_taxes" valuePropName="checked">
                            <Switch checkedChildren="Yes" className="bg-gray-600" unCheckedChildren="No" defaultChecked={false} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item className="flex justify-end gap-4">
                    <Button loading={loading} htmlType="submit" className="ml-4 flex h-12 w-full flex-row items-center justify-center bg-blue-500 p-4 text-lg tracking-wide text-white">
                        Create Account
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomerForm;
