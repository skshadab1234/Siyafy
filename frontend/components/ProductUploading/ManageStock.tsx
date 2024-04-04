import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';

const { Option } = Select;

const ManageStock = ({ form }: any) => {
    return (
        <div>
            <h1 className='text-xl md:text-4xl text-slate-600 my-6 font-semibold tracking-wide'>Manage Stock</h1>
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Stock Quantity" name="stock_quantity">
                            <Input type="number" className="h-12" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item label="Stock Status" initialValue={'instock'} name="stock_status">
                            <Select className='h-12'>
                                <Option value="instock">In Stock</Option>
                                <Option value="outofstock">Out of Stock</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ManageStock;
