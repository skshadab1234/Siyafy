import React, { useState } from 'react';
import { Form, Switch, Rate, Input, Select, Button } from 'antd';

const { Option } = Select;

const ProductSetting = ({ form }: any) => {
    const [toggle, setToggleTax] = useState(false);
    // Function to generate a 12-digit parent ID
    const generateParentId = () => {
        const length = 12;
        const characters = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleTaxableChange = (value: boolean) => {
        setToggleTax(value);
    };

    return (
        <div className="mb-20">
            <h1 className="my-6 text-xl font-semibold tracking-wide text-slate-600 md:text-4xl">Product Setting</h1>
            <Form form={form} layout="vertical">
                <Form.Item name="review_allowed" label="Review Allowed">
                    <Switch className="bg-gray-500" />
                </Form.Item>
                <Form.Item name="average_rating" label="Average Rating">
                    <Rate allowHalf defaultValue={1} count={3} />
                </Form.Item>
                <Form.Item name="parent_id" initialValue={generateParentId()} label="Unique ID">
                    <Input readOnly />
                </Form.Item>
                <Form.Item name="purchase_note" label="Purchase Note">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="meta_title"
                    label="Meta Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the meta title!', // This message is displayed if the field is left empty.
                        },
                    ]}
                >
                    <Input className="h-12" />
                </Form.Item>
                <Form.Item
                    name="meta_description"
                    label="Meta Description"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the meta description!', // This message is displayed if the field is left empty.
                        },
                    ]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="meta_keywords"
                    label="Meta Keywords"
                    rules={[
                        {
                            required: true,
                            message: 'Please add at least one keyword',
                            type: 'array',
                        },
                    ]}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Add keywords"
                        dropdownStyle={{ display: 'none' }} // Hide the dropdown, so it acts purely as a tag input
                        tokenSeparators={[',']} // Allow comma to separate entries
                    >
                        {/* Options will be dynamically created based on input */}
                    </Select>
                </Form.Item>

                <Form.Item name="taxable" label="Taxable" valuePropName="checked">
                    <Switch className="bg-gray-500" onChange={handleTaxableChange} />
                </Form.Item>
                {toggle && (
                    <Form.Item name="tax_class" label="Tax Class">
                        <Select>
                            <Option value="tax_class_1">Tax Class 1</Option>
                            <Option value="tax_class_2">Tax Class 2</Option>
                            <Option value="tax_class_3">Tax Class 3</Option>
                        </Select>
                    </Form.Item>
                )}
                <Form.Item name="sold_individually" label="Sold Individually" valuePropName="checked">
                    <Switch className="bg-gray-500" />
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProductSetting;
