import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';

const AddPhoneNumber = ({ onSubmit, loading }) => {
    const [form] = Form.useForm();
    
    const handleSubmit = async (values) => {
        try {
            await onSubmit(values.phoneNumber);
            form.resetFields();
            message.success('Phone number added successfully');
        } catch (error) {
            message.error('Failed to add phone number');
        }
    };

    return (
        <div className="add-phone-container">
            <h2>Add Phone Number</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        { required: true, message: 'Please enter your phone number' },
                        { pattern: /^[0-9+-]+$/, message: 'Please enter a valid phone number' }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Enter your phone number"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Phone Number
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddPhoneNumber;